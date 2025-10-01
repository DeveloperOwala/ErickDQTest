import express from 'express';
import {prisma} from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  //if(!email || !password) return res.status(400).send({error:'email/password required'});
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({data:{email, password: hashed}});
  res.status(201).send({id: user.id, email: user.email});
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({where:{email}});
  if(!user) return res.status(401).send({error:'invalid credentials'});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).send({error:'invalid credentials'});
  const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET || 'dev', {expiresIn: '8h'});
  res.send({token});
});

export default router;
