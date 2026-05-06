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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="glass-card-effect rounded-xl md:rounded-lg shadow p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 border-white/10 hover:border-white/20 transition-all duration-300">
              <div>
                <p className="text-xs md:text-sm text-white/60 mb-1 line-clamp-1" title={stat.title}>{stat.title}</p>
                <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 md:p-3 rounded-lg self-start md:self-auto shadow-lg`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card-effect rounded-2xl shadow-sm border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
             <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <Package className="w-4 h-4" />
             </span>
             {labels.confirmedTitle}
          </h2>
          <Link href={`/${locale}/admin/orders`} className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
            {labels.viewAll} →
          </Link>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {stats.recentConfirmedOrders.map((order) => (
            <div key={order.id} className="p-4 bg-transparent space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-white">#{order.orderNumber}</div>
                  <div className="text-xs text-white/50">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${order.status === 'DELIVERED'
                    ? 'bg-green-500/20 text-green-400'
                    : order.status === 'CONFIRMED'
                      ? 'bg-blue-500/20 text-blue-400'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                >
                  {t(order.status.toLowerCase())}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-white/80 line-clamp-1">{order.customerName}</span>
                <span className="font-bold text-white">{formatPrice(Number(order.totalAmount))}</span>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-end">
                <Link
                  href={`/${locale}/admin/orders/${order.id}`}
                  className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg"
                >
                  {t('view')}
                </Link>
              </div>
            </div>
          ))}
          {stats.recentConfirmedOrders.length === 0 && (
            <div className="p-8 text-center text-white/40 italic">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
              {t('noOrders')}
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('orderId')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('customer')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-bold text-white/40 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentConfirmedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 font-medium">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                    {formatPrice(Number(order.totalAmount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'DELIVERED'
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'CONFIRMED'
                          ? 'bg-blue-500/20 text-blue-400'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                    >
                      {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
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
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 italic">
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

