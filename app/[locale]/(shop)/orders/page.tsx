import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import { OrdersList } from '@/components/orders-list';

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { locale } = await params;
  const { orderNumber } = await searchParams;

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const userOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
          package: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedOrders = userOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(item => {
      let name = '';
      if (item.product) {
        name = locale === 'ar' ? item.product.nameAr : locale === 'fr' ? item.product.nameFr : item.product.nameEn || item.product.nameFr;
      } else if (item.package) {
        name = locale === 'ar' ? item.package.nameAr : locale === 'fr' ? item.package.nameFr : item.package.nameEn || item.package.nameFr;
      }

      return {
        name,
        quantity: item.quantity,
        price: Number(item.unitPrice)
      };
    })
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          {locale === 'ar' ? 'طلباتي' : locale === 'fr' ? 'Mes commandes' : 'My Orders'}
        </h1>

        <OrdersList locale={locale} orderNumber={orderNumber} orders={formattedOrders} />
      </div>
    </main>
  );
}
