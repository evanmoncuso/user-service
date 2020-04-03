import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { decode, encode } from '../helpers/jsonapi';

interface User {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  permissions: number[];
}

export async function createUser(req: Request, res: Response) {
  try {
    const { body } = req;

    const user: User = decode(body);
    const { password } = user;

    // password is at most 64 characters long
    if (password.length > 64) {
      res.status(400).send({
        error: 'Password is too long. Password must be less that 65 characters'
      });
    }

    const h = await bcrypt.hash(password, 12);
    user.password = h;

    res.status(201).send(encode(user, 'user'));
  } catch(e) {
    console.log(e);
    res.status(500).send({
      error: e
    })
  }


}