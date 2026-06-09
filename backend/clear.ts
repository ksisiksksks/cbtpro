import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  await prisma.user.deleteMany({ where: { role: 'STUDENT' }});
  console.log('Students deleted');
}
run();
