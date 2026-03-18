import { PrismaClient } from '@prisma/client';

async function test() {
  const url = "postgresql://neondb_owner:npg_MWJ4pch2kVgK@ep-purple-dawn-ajgguvob.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require";
  console.log('Testing Non-Pooler URL...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    const count = await prisma.product.count();
    console.log('Success! Product count:', count);
  } catch (err: any) {
    console.error('Failed with Non-Pooler URL:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
