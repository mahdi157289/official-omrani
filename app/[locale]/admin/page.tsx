import { requireAdmin } from '@/lib/auth-helpers';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';
import { AdminPendingOrdersPanel } from '@/components/admin/pending-orders-panel';

async function getStats() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const [products, orders, totalRevenue, users, recentConfirmedOrders] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } }, // Revenue from non-cancelled orders
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        where: { status: { not: 'PENDING' } }, // Only confirmed, delivered, or cancelled
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
    ]);

    const revenue = totalRevenue._sum.totalAmount
      ? Number(totalRevenue._sum.totalAmount)
      : 0;

    return {
      products,
      orders,
      revenue,
      users,
      recentConfirmedOrders,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      products: 0,
      orders: 0,
      revenue: 0,
      users: 0,
      recentConfirmedOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const stats = await getStats();

  const labels = {
    ar: {
      confirmedTitle: 'الطلبات المؤكدة مؤخراً',
      viewAll: 'عرض الكل',
    },
    fr: {
      confirmedTitle: 'Commandes Confirmées Récentes',
      viewAll: 'Voir tout',
    },
    en: {
      confirmedTitle: 'Recent Confirmed Orders',
      viewAll: 'View All',
    }
  }[locale as 'ar' | 'fr' | 'en'] || {
    confirmedTitle: 'Recent Confirmed Orders',
    viewAll: 'View All',
  };

  const statCards = [
    {
      title: t('activeProducts'),
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: t('totalOrders'),
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: t('totalRevenue'),
      value: `${Number(stats.revenue).toFixed(3)} DT`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: t('customers'),
      value: stats.users,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard')}</h1>

      {/* Live Pending Orders Panel */}
      <AdminPendingOrdersPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <Package className="w-4 h-4" />
             </span>
             {labels.confirmedTitle}
          </h2>
          <Link href={`/${locale}/admin/orders`} className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
            {labels.viewAll} →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/30">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('orderId')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('customer')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {stats.recentConfirmedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {formatPrice(Number(order.totalAmount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <Link
                      href={`/${locale}/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/20 transition-all font-bold"
                      title={t('view')}
                    >
                      {t('view')}
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentConfirmedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    {t('noOrders')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

