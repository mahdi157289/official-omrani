const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pkgs = await prisma.package.findMany();
  console.log(JSON.stringify(pkgs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
