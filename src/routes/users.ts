import { Request, Response } from 'express';

export function createUser(req: Request, res: Response) {
  const { body } = req;

  console.log(body);

  res.sendStatus(204);
}