import { Request, Response } from 'express';
import User, { UserInterface } from '../data/models/user';

import { decode, encode } from '../helpers/jsonapi';

export async function getUserByUUID(req: Request, res: Response) {
  const record = await User.findOne({ 
    where: { uuid: req.params.user_uuid },
  })

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
  delete updates.createdAt;
  delete updates.lastModified;

  record.permissions.forEach((p) => {
    // clear out the "id" field, use uuid instead
    delete p.id;
  });

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
    console.log(e);
    res.status(500)
  }
}