import express from 'express';
import {prisma} from '../prisma';
import {authenticate, AuthRequest} from '../middleware/auth';
const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const {name, email, phone, address} = req.body;
  const c = await prisma.customer.create({data:{name, email, phone, address}});
  res.status(201).send(c);
});

router.get('/', authenticate, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);
  const skip = (page-1) * limit;
  const [items, total] = await Promise.all([
    prisma.customer.findMany({skip, take: limit}),
    prisma.customer.count()
  ]);
  res.send({page, limit, total, items});
});

router.get('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const c = await prisma.customer.findUnique({where:{id}, include:{orders:true}});
  if(!c) return res.status(404).send({error:'not found'});
  res.send(c);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const updated = await prisma.customer.update({where:{id}, data});
  res.send(updated);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  await prisma.order.deleteMany({where:{customerId: id}});
  await prisma.customer.delete({where:{id}});
  res.status(204).send();
});

export default router;
