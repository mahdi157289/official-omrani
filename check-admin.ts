const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@makroudhomrani.tn' }
    });
    if (user) {
        console.log('User found:', user.email);
        console.log('Role:', user.role);
        console.log('Status:', user.status);
        console.log('Has password:', !!user.password);
    } else {
        console.log('User NOT found');
    }
    await prisma.$disconnect();
}

checkUser();
