import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import User, { UserInterface } from '../data/models/user';
import Permission from '../data/models/permission';
import { decode, encode } from '../helpers/jsonapi';

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { body } = req;

    const user: UserInterface = decode(body);
    const { username, password } = user;

    if (!username || !password) {
      res.status(400).send({
        errors: [{ message: 'Body does not contain username and/or password field(s)' }]
      })
      return
    }

    if (user.permissions.length === 0) {
      res.status(400).send({
        errors: [{ message: 'User needs at least one permission level' }]
      });
      return
    }

    // password is at most 64 characters long
    if (password.length > 64) {
      res.status(400).send({
        error: 'Password is too long. Password must be less that 65 characters'
      });
      return
    }

    const h = await bcrypt.hash(password, 12);
    user.password = h;

    const record = new User();
    record.username = user.username;
    record.password = user.password;

    // optional fields
    if (user.firstName) record.firstName = user.firstName;
    if (user.lastName) record.lastName = user.lastName;
    if (user.emailAddress) record.emailAddress = user.emailAddress;

    // can't create users who are admins
    user.permissions = user.permissions.filter((p) => p !== 'ADMIN');

    // find permissions if they exist
    const permissions = await Promise.all(
      user.permissions.map(async (permissionName) => {
        const p: Permission | undefined = await Permission.findOne({
          where: { title: permissionName.toUpperCase() }
        });

        if (!p) throw new Error(`Unable to find permission of type: "${permissionName}"`);

        return p;
      })
    );

    record.permissions = permissions;

    await record.save();

    record.permissions.forEach((p) => {
      // clear out the "id" field, use uuid instead
      delete p.id;
    });
    delete record.password;

    res.status(201).send(encode(record, 'user', { useUUID: true }));
  } catch(e) {
    res.status(500).send({
      error: e.message
    })
  }
}