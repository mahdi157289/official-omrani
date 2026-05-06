import { requireAdmin } from '@/lib/auth-helpers';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

async function getOrders() {
  try {
    const { prisma } = await import('@/lib/prisma');
    return await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const orders = await getOrders();

  const pending = orders.filter(o => o.status === 'PENDING');
  const others = orders.filter(o => o.status !== 'PENDING');
  const sorted = [...pending, ...others];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{t('orders')}</h1>
        {pending.length > 0 && (
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold animate-pulse">
            🔔 {pending.length} {locale === 'ar' ? 'طلب جديد' : locale === 'fr' ? 'nouvelle(s) commande(s)' : 'new order(s)'}
          </span>
        )}
      </div>

      <div className="glass-card-effect rounded-2xl shadow overflow-hidden border border-white/10">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {sorted.map((order) => (
            <div key={order.id} className={`p-4 bg-transparent space-y-3 ${order.status === 'PENDING' ? 'bg-orange-500/10 border-l-4 border-l-orange-400' : ''}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">#{order.orderNumber}</span>
                  <span className="text-xs text-white/50">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-500/20 text-green-400'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400'
                      : order.status === 'PENDING'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {t(order.status.toLowerCase())}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 text-sm">
                <div className="font-semibold text-white/90 flex justify-between">
                  <span className="line-clamp-1">{order.customerName}</span>
                  <span className="font-bold text-white">{formatPrice(Number(order.totalAmount))}</span>
                </div>
                {order.customerPhone && (
                  <a href={`tel:${order.customerPhone}`} className="text-blue-600 font-semibold flex items-center gap-1 w-fit">
                    📞 {order.customerPhone}
                  </a>
                )}
                {order.deliveryAddress && (
                  <span className="text-white/60 line-clamp-1 text-xs" title={order.deliveryAddress}>
                    📍 {order.deliveryAddress}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">
                  {order.items.length} {t('itemCount')}
                </span>
                <Link
                  href={`/${locale}/admin/orders/${order.id}`}
                  className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg"
                >
                  {t('view')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('orderId')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('customer')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {locale === 'ar' ? 'هاتف' : locale === 'fr' ? 'Téléphone' : 'Phone'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {locale === 'ar' ? 'العنوان' : locale === 'fr' ? 'Adresse' : 'Address'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('items')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-4 py-3 text-end text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-white/5 transition-colors ${order.status === 'PENDING' ? 'bg-orange-500/10 border-l-4 border-l-orange-400' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-white/90">{order.customerName}</div>
                    {order.customerNotes && (
                      <div className="text-xs text-white/40 italic max-w-[120px] truncate" title={order.customerNotes}>
                        📝 {order.customerNotes}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.customerPhone ? (
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        📞 {order.customerPhone}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600 max-w-[160px] block truncate" title={order.deliveryAddress || ''}>
                      {order.deliveryAddress || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {order.items.length} {t('itemCount')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {formatPrice(Number(order.totalAmount))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-500/20 text-red-400'
                          : order.status === 'PENDING'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white/50">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-white/30">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <Link
                      href={`/${locale}/admin/orders/${order.id}`}
                      className="text-primary hover:text-primary-dark font-semibold"
                    >
                      {t('view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 glass-card-effect rounded-2xl shadow">
          <p className="text-white/60">{t('noOrders')}</p>
        </div>
      )}
    </div>
  );
}
