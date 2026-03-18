// No import needed for fetch in Node 18+ (which we are using)

const BASE_URL = 'http://localhost:3002'; // Port from dev server logs

async function runTests() {
  console.log('🚀 Starting User Story Tests...');

  // 1. User Registration
  console.log('\n📝 Testing User Registration...');
  const uniqueId = Date.now();
  const userData = {
    firstName: 'Test',
    lastName: `User${uniqueId}`,
    email: `test${uniqueId}@example.com`,
    phone: `55${uniqueId.toString().slice(-6)}`,
    password: 'password123'
  };

  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (regRes.ok) {
      const regData = await regRes.json();
      console.log('✅ Registration Successful:', regData.user.email);
    } else {
      console.error('❌ Registration Failed:', await regRes.text());
      return;
    }
  } catch (e) {
    console.error('❌ Registration Error (Check if server is running on port 3002):', e);
    return;
  }

  // 2. Add to Cart
  console.log('\nZE Testing Add to Cart...');
  const sessionId = `test-session-${uniqueId}`;
  let productId;

  // First fetch products to get a valid ID
  try {
    const productsRes = await fetch(`${BASE_URL}/api/products?locale=en`);
    const productsData = await productsRes.json();
    
    if (productsData.products && productsData.products.length > 0) {
      productId = productsData.products[0].id;
      console.log('📦 Found Product:', productsData.products[0].nameEn || productsData.products[0].nameFr);
    } else {
      console.error('❌ No products found to add to cart');
      return;
    }
  } catch (e) {
    console.error('❌ Error fetching products:', e);
    return;
  }

  try {
    const cartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        productId,
        quantity: 2
      })
    });

    if (cartRes.ok) {
      const cartData = await cartRes.json();
      console.log('✅ Added to Cart. Cart Size:', cartData.cart.length);
    } else {
      console.error('❌ Add to Cart Failed:', await cartRes.text());
      return;
    }
  } catch (e) {
    console.error('❌ Add to Cart Error:', e);
    return;
  }

  // 3. Checkout & Order Placement
  console.log('\n💳 Testing Checkout & Order Placement...');
  const orderData = {
    items: [{
      productId,
      quantity: 2,
      price: 10, // Simulating price, in real app backend verifies
      total: 20,
      variantName: 'Standard'
    }],
    customer: {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      address: '123 Test St',
      city: 'Test City',
      notes: 'Test Order'
    },
    total: 27, // 20 + 7 delivery
    deliveryFee: 7,
    sessionId
  };

  try {
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (orderRes.ok) {
      const order = await orderRes.json();
      console.log('✅ Order Placed Successfully!');
      console.log('   Order Number:', order.orderNumber);
      console.log('   Customer:', order.customerName);
      console.log('   Total:', order.totalAmount);
    } else {
      console.error('❌ Order Placement Failed:', await orderRes.text());
    }
  } catch (e) {
    console.error('❌ Order Placement Error:', e);
  }

  console.log('\n✨ All tests completed.');
}

runTests();
