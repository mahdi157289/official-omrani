import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding exchange rates...');

  await prisma.siteConfig.upsert({
    where: { key: 'exchange_rate_usd' },
    update: {},
    create: {
      key: 'exchange_rate_usd',
      group: 'currency',
      value: '0.32',
      valueType: 'number',
      labelAr: 'سعر صرف الدولار (TND -> USD)',
      labelFr: 'Taux de change USD (TND -> USD)',
      isPublic: true,
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'exchange_rate_eur' },
    update: {},
    create: {
      key: 'exchange_rate_eur',
      group: 'currency',
      value: '0.30',
      valueType: 'number',
      labelAr: 'سعر صرف اليورو (TND -> EUR)',
      labelFr: 'Taux de change EUR (TND -> EUR)',
      isPublic: true,
    },
  });

  console.log('✅ Exchange rates seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
