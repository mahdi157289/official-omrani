import { requireAdmin } from '@/lib/auth-helpers';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { getAdminTranslations } from '@/lib/admin-translations';

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
      take: 50,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const t = await getAdminTranslations();
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('orders')}</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                {t('items')}
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.items.length} {t('itemCount')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    {t('view')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">{t('noOrders')}</p>
        </div>
      )}
    </div>
  );
}


