import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

async function main() {
    console.log('Testing connection to:', process.env.DATABASE_URL?.split('@')[1] || 'URL not found');
    
    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('✅ Connection successful!');

        const productCount = await prisma.product.count();
        console.log('Total Products:', productCount);
        
        const activeFeaturedCount = await prisma.product.count({
            where: { status: 'ACTIVE', isFeatured: true }
        });
        console.log('Active Featured Products:', activeFeaturedCount);
        
        const packageCount = await prisma.package.count();
        console.log('Total Packages:', packageCount);
        
        const activePackageCount = await prisma.package.count({
            where: { isActive: true }
        });
        console.log('Active Packages:', activePackageCount);

        if (productCount === 0 && packageCount === 0) {
            console.log('\n⚠️ The database is connected but looks empty. You might need to run the seed script: npm run db:seed');
        }

    } catch (error: any) {
        console.error('\n❌ Database connection failed!');
        console.error('Error Code:', error.code);
        console.error('Message:', error.message);
        
        if (error.message.includes('Can\'t reach database server')) {
            console.log('\n💡 Tip: Check if your database host is accessible and that your IP is allowed in Neon console.');
        }
    }
}

main()
    .finally(() => prisma.$disconnect());

