import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string, email: string }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if(!h) return res.status(401).send({error:'missing auth'});
  const parts = h.split(' ');
  if(parts.length !== 2) return res.status(401).send({error:'invalid auth format'});
  const token = parts[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
    req.user = { userId: data.userId, email: data.email };
    next();
  } catch(e) {
    return res.status(401).send({error:'invalid token'});
  }
}
