import { requireAdmin } from '@/lib/auth-helpers';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

async function getStats() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const [products, orders, totalRevenue, users, recentOrders] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 5,
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
      recentOrders,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      products: 0,
      orders: 0,
      revenue: 0,
      users: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const stats = await getStats();

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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('recentOrders')}</h2>
          <Link href={`/${locale}/admin/orders`} className="text-primary hover:text-primary-dark text-sm">
            {t('viewAll')}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderId')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('customer')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(Number(order.totalAmount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
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
                      className="text-primary hover:text-primary-dark"
                    >
                      {t('view')}
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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

