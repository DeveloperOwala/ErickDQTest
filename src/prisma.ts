import {PrismaClient} from '@prisma/client';
export const prisma = new PrismaClient();

export async function initPrisma() {
  try {
    await prisma.$connect();
    console.log('Prisma connected');
  } catch(e) {
    if (e instanceof Error) {
      console.warn('Prisma connection failed:', e.message);
    } else {
      console.warn('Prisma connection failed:', e);
    }
    throw e;
  }
}
