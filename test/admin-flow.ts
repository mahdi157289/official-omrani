import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3002'; // Using port 3002 as per user-flow.ts

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAdminTest() {
  console.log('🚀 Starting Admin User Story Tests...');

  // 1. Setup Admin User & Category
  const uniqueId = Date.now();
  const email = `admin${uniqueId}@example.com`;
  const password = 'password123';
  
  console.log(`\n👤 Creating Admin User: ${email}`);
  
  // Create Category for product test
  const category = await prisma.category.create({
    data: {
      nameAr: `تصنيف ${uniqueId}`,
      nameFr: `Category ${uniqueId}`,
      slug: `category-${uniqueId}`,
      descriptionAr: 'desc',
      descriptionFr: 'desc'
    }
  });
  console.log(`✅ Category created: ${category.nameFr} (ID: ${category.id})`);

  try {
    // Register via API to simulate real user creation
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Admin',
        lastName: 'User',
        email,
        phone: `99${uniqueId.toString().slice(-6)}`,
        password
      })
    });

    if (!regRes.ok) {
      throw new Error(`Registration failed: ${await regRes.text()}`);
    }
    console.log('✅ User registered via API');

    // Update role to ADMIN directly in DB
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log('✅ User promoted to ADMIN role in DB');

  } catch (e) {
    console.error('❌ Setup failed:', e);
    await prisma.$disconnect();
    return;
  }

  // Launch Browser
  const browser = await puppeteer.launch({ 
    headless: false, // Visible browser for verification
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Listen for alerts and console logs
  page.on('dialog', async dialog => {
    console.log('🚨 Alert Dialog:', dialog.message());
    await dialog.dismiss();
  });
  page.on('console', msg => console.log('🖥️ Browser Console:', msg.text()));

  try {
    // 2. Login Flow
    console.log('\n🔑 Logging in as Admin...');
    await page.goto(`${BASE_URL}/login`);
    
    // Wait for form
    await page.waitForSelector('#email');
    await page.type('#email', email);
    await page.type('#password', password);
    
    // Click submit and wait for navigation
    const navPromise = page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('button[type="submit"]');
    await navPromise;
    
    console.log('✅ Logged in successfully');

    // 3. Verify Admin Access Button
    console.log('\n🛡️ Testing Admin Panel Access...');
    // The button we added in navigation.tsx
    const adminBtnSelector = 'a[href="/admin"]';
    
    try {
      await page.waitForSelector(adminBtnSelector, { timeout: 5000 });
      console.log('✅ Admin Button found in Navigation');
    } catch (e) {
      throw new Error('Admin Button not found in navigation bar!');
    }

    // Click it
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click(adminBtnSelector)
    ]);
    
    if (page.url().includes('/admin')) {
      console.log('✅ Navigated to Admin Dashboard');
    } else {
      throw new Error(`Failed to navigate to Admin Dashboard. Current URL: ${page.url()}`);
    }

    // 4. Product Management (Create)
    console.log('\n📦 Testing Product Creation...');
    await page.goto(`${BASE_URL}/admin/products/new`);
    
    const productName = `Test Product ${uniqueId}`;
    await page.waitForSelector('input[name="nameAr"]');
    
    await page.type('input[name="nameAr"]', `${productName} AR`);
    await page.type('input[name="nameFr"]', `${productName} FR`);
    await page.type('input[name="slug"]', `product-${uniqueId}`);
    await page.type('input[name="basePrice"]', '50.00');
    await page.type('input[name="sku"]', `SKU-${uniqueId}`);
    await page.type('input[name="stockQuantity"]', '100');
    
    // Select Category
    await page.select('select[name="categoryId"]', category.id);

    // Fill description
    await page.type('textarea[name="descriptionAr"]', 'وصف تجريبي');
    await page.type('textarea[name="descriptionFr"]', 'Description de test');
    
    // Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('➡️ Form submitted');
      // Wait for redirect or success
      await delay(5000); 
    }
    
    // Verify in DB
    const product = await prisma.product.findFirst({
      where: { nameFr: `${productName} FR` }
    });
    
    if (product) {
      console.log(`✅ Product created and verified in DB (ID: ${product.id})`);
    } else {
      const content = await page.content();
      console.log('📄 Page Content (snippet):', content.slice(0, 1000));
      throw new Error('Product creation failed - not found in DB');
    }

    // 5. Order Management
    console.log('\n🚚 Testing Order Status Update...');
    // Create a dummy order for this user
    const user = await prisma.user.findUnique({ where: { email } });
    const order = await prisma.order.create({
      data: {
        userId: user!.id,
        orderNumber: `ORD-${uniqueId}`,
          totalAmount: 100,
          subtotal: 100,
          deliveryFee: 0,
          taxAmount: 0,
          discountAmount: 0,
          status: 'PENDING',
        paymentStatus: 'PENDING',
        customerName: 'Admin User',
        customerEmail: email,
        customerPhone: '12345678',
        deliveryAddress: 'Test Address',
        deliveryType: 'DELIVERY',
        items: {
            create: {
                productId: product!.id,
                quantity: 1,
                unitPrice: 50,
                totalPrice: 50,
                variantNameAr: 'Default'
            }
        }
      }
    });
    console.log(`✅ Test Order created via Prisma (ID: ${order.id})`);

    // Navigate to order details
    await page.goto(`${BASE_URL}/admin/orders/${order.id}`);
    
    // Wait for select element
    await page.waitForSelector('select');
    
    // Change status to CONFIRMED
    console.log('🔄 Changing status to CONFIRMED...');
    await page.select('select', 'CONFIRMED');
    // Wait for API call
    await delay(5000);
    
    // Verify in DB
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id }
    });
    
    if (updatedOrder?.status === 'CONFIRMED') {
      console.log('✅ Order status updated successfully to CONFIRMED');
    } else {
      throw new Error(`Order status update failed. Current status: ${updatedOrder?.status}`);
    }

    console.log('\n✨ All Admin User Stories Passed! ✨');

  } catch (e) {
    console.error('❌ Test Execution Failed:', e);
    await page.screenshot({ path: 'test-failure.png' });
    console.log('📸 Screenshot saved to test-failure.png');
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

runAdminTest();
