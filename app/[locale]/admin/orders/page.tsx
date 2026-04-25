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
        <h1 className="text-3xl font-bold text-gray-900">{t('orders')}</h1>
        {pending.length > 0 && (
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold animate-pulse">
            🔔 {pending.length} {locale === 'ar' ? 'طلب جديد' : locale === 'fr' ? 'nouvelle(s) commande(s)' : 'new order(s)'}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderId')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('customer')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'هاتف' : locale === 'fr' ? 'Téléphone' : 'Phone'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'العنوان' : locale === 'fr' ? 'Adresse' : 'Address'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('items')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sorted.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 ${order.status === 'PENDING' ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900">{order.customerName}</div>
                    {order.customerNotes && (
                      <div className="text-xs text-gray-400 italic max-w-[120px] truncate" title={order.customerNotes}>
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatPrice(Number(order.totalAmount))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'PENDING'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
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
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <p className="text-gray-600">{t('noOrders')}</p>
        </div>
      )}
    </div>
  );
}
