import { NextResponse } from 'next/server';
import { getCart, setCart, CartItem } from '@/lib/cart-store';

export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'default';
    const locale = searchParams.get('locale') || 'ar';

    const cartItems = getCart(sessionId);

    if (cartItems.length === 0) {
      return NextResponse.json({ cart: [], total: 0 });
    }

    const hydratedCart = await Promise.all(cartItems.map(async (item) => {
      try {
        if (item.type === 'package' && item.packageId) {
          const pkg = await prisma.package.findUnique({
            where: { id: item.packageId },
            include: { image: true }
          });

          if (!pkg) return null;

          const price = pkg.discountPrice
            ? Number(pkg.discountPrice)
            : (typeof pkg.price === 'object' && pkg.price !== null && 'toNumber' in pkg.price
              ? (pkg.price as any).toNumber()
              : Number(pkg.price));
          const name = locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr;

          return {
            ...item,
            productSlug: pkg.slug,
            productName: name,
            productImage: pkg.image?.url,
            price,
            total: price * item.quantity,
            variantName: locale === 'ar' ? 'باقة' : locale === 'fr' ? 'Pack' : 'Package'
          };
        } else if (item.productId) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            include: {
              images: true,
              variants: true
            }
          });

          if (!product) return null;

          let price = typeof product.basePrice === 'object' && product.basePrice !== null && 'toNumber' in product.basePrice
            ? (product.basePrice as any).toNumber()
            : Number(product.basePrice);
          let variantName = null;

          if (item.variantId) {
            const variant = product.variants.find((v: any) => v.id === item.variantId);
            if (variant) {
              const modifier = typeof variant.priceModifier === 'object' && variant.priceModifier !== null && 'toNumber' in variant.priceModifier
                ? (variant.priceModifier as any).toNumber()
                : Number(variant.priceModifier);
              price += modifier;
              variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
            }
          }

          const productName = locale === 'ar'
            ? product.nameAr
            : locale === 'fr'
              ? product.nameFr
              : product.nameEn || product.nameFr;

          return {
            ...item,
            productSlug: product.slug,
            productName,
            productImage: product.images[0]?.url,
            price,
            total: price * item.quantity,
            variantName
          };
        }
        return null;
      } catch (e) {
        console.error('Error fetching details', e);
        return null;
      }
    }));

    const validCart = hydratedCart.filter((item: any) => item !== null);
    const totalAmount = validCart.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

    return NextResponse.json({ cart: validCart, total: totalAmount });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId = 'default', productId, packageId, variantId, quantity = 1, type = 'product' } = body;

    if (type === 'product' && !productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (type === 'package' && !packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Get or create cart
    const cart = getCart(sessionId);

    // Check if item already exists
    const id = type === 'package'
      ? `pkg-${packageId}`
      : `${productId}-${variantId || 'default'}`;

    const existingIndex = cart.findIndex(
      (item) => item.id === id
    );

    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id,
        productId,
        packageId,
        type,
        variantId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    setCart(sessionId, cart);
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sessionId = 'default', itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }

    const cart = getCart(sessionId);
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }

    setCart(sessionId, cart);
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'default';
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const cart = getCart(sessionId);
    const filteredCart = cart.filter((item) => item.id !== itemId);
    setCart(sessionId, filteredCart);

    return NextResponse.json({ success: true, cart: filteredCart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
