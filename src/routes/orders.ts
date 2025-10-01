import express from 'express';
import {prisma} from '../prisma';
import {authenticate, AuthRequest} from '../middleware/auth';
const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const {customerId, total, status, metadata} = req.body;
  const o = await prisma.order.create({data:{customerId, total: Number(total), status: status || 'pending', metadata}});
  res.status(201).send(o);
});

router.get('/', authenticate, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);
  const skip = (page-1) * limit;
  const where: any = {};
  if(req.query.status) where.status = String(req.query.status);
  const [items, total] = await Promise.all([
    prisma.order.findMany({skip, take: limit, where, include:{customer:true}}),
    prisma.order.count({where})
  ]);
  res.send({page, limit, total, items});
});

router.get('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const o = await prisma.order.findUnique({where:{id}, include:{customer:true}});
  if(!o) return res.status(404).send({error:'not found'});
  res.send(o);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const updated = await prisma.order.update({where:{id}, data});
  res.send(updated);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  await prisma.order.delete({where:{id}});
  res.status(204).send();
});

export default router;
