import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Dumping Products ---');
    const products = await prisma.product.findMany({
        take: 5,
        include: {
            category: true,
        }
    });

    products.forEach(p => {
        console.log(`Product: ${p.id} | Slug: ${p.slug} | Status: ${p.status} | Category: ${p.category?.slug}`);
    });

    console.log('--- Dumping Packages ---');
    const packages = await prisma.package.findMany({
        take: 5
    });

    packages.forEach(p => {
        console.log(`Package: ${p.id} | Slug: ${p.slug} | IsActive: ${p.isActive}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
