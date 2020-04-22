import { Request, Response } from 'express';
import User, { UserInterface } from '../data/models/user';
import Permission from '../data/models/permission';

import { decode, encode } from '../helpers/jsonapi';

export async function getUserByUUID(req: Request, res: Response) {
  try {
    // users can only access their own info
    if (
      res.locals.id !== req.params.user_uuid
      && !res.locals.permissions.includes('ADMIN')
    ) {
      res.status(401).send({
        error: 'Non admin users can only access their own information'
      });
      return
    }

    const record = await User.findOne({ 
      where: { uuid: req.params.user_uuid },
    });

    if (record === undefined) {
      res.status(404).send({
        error: 'No record found of uuid'
      });
      return
    }

    record.permissions.forEach((p) => {
      // clear out the "id" field, use uuid instead
      delete p.id;
    });

    res.send(encode(record, 'user', { useUUID: true }));
  } catch(e) {
    res.status(500).send({
      error: e.message
    })
  }
}

export async function editUser(req: Request, res: Response) {
  const { body } = req;
  const uuid = req.params.user_uuid;

  const record = await User.findOne({
    where: { uuid },
  });

  if (record === undefined) {
    res.status(404).send({
      error: 'No record found of uuid'
    });
    return
  }


  const updates: UserInterface = decode(body);

  // can't update certain fields, so just disregard them
  delete updates.id;
  delete updates.uuid;
  delete updates.username;
  delete updates.password;
  delete updates.permissions;
  delete updates.createdAt;
  delete updates.lastModified;

  res.sendStatus(204)
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const uuid = req.params.user_uuid;

    const record = await User.findOne({
      where: { uuid },
    });

    if (record === undefined) {
      res.status(404).send({
        error: 'No record found of uuid'
      });
      return
    }

    record.remove();

    res.sendStatus(204)
  } catch(e) {
    res.status(500)
  }
}

export async function promoteUser(req: Request, res: Response) {
  try {
    const uuid = req.params.user_uuid;
    const record = await User.findOne({
      where: { uuid }
    });

    if (record === undefined) {
      res.status(404).send({
        error: 'No record found of uuid'
      });
      return
    }

    const permissionNames = record.permissions.map(({ title }: Permission) => title);
    const permissions = await Promise.all(
      req.body.permissions.map(async (permissionName: string) => {
        const p: Permission | undefined = await Permission.findOne({
          where: { title: permissionName.toUpperCase() }
        });

        if (!p) throw new Error(`Unable to find permission of type: "${permissionName}"`);

        return p;
      })
    );

    const permissionsToAdd = permissions.filter(({ title }) => !permissionNames.includes(title));

    if (permissionsToAdd.length) {
      record.permissions = record.permissions.concat(permissionsToAdd);
      await record.save();
    }

    res.send(encode(record, 'user', { useUUID: true }));
  } catch(e) {
    res.status(500);
  }
}

export async function revokeUserPermission(req: Request, res: Response) {
  try {
    const uuid = req.params.user_uuid;
    const record = await User.findOne({
      where: { uuid }
    });

    if (record === undefined) {
      res.status(404).send({
        error: 'No record found of uuid'
      });
      return
    }

    const finalPermissions = record.permissions.filter(({ title }) => !req.body.permissions.includes(title));

    if (finalPermissions.length !== record.permissions.length) {
      record.permissions = finalPermissions
      await record.save();
    }

    res.send(encode(record, 'user', { useUUID: true }));
  } catch (e) {
    res.status(500);
  }
}