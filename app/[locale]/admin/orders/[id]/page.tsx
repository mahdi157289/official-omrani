import { requireAdmin } from '@/lib/auth-helpers';
// Use dynamic import for prisma 
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { OrderStatusSelector } from '@/components/admin/order-status-selector';
import { ArrowLeft, User, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { getAdminLocale } from '@/lib/admin-translations';

async function getOrder(id: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            package: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error('Error fetching admin order details:', error);
    return null;
  }
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getAdminLocale();
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/${locale}/admin/orders`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => {
                const productName = item.product
                  ? `${item.product.nameFr} / ${item.product.nameAr}`
                  : item.package
                    ? `${item.package.nameFr} / ${item.package.nameAr}`
                    : 'Unknown Item';

                return (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {/* Add image if available */}
                        <span className="text-xs text-gray-500">Image</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.variantNameFr ? `${item.variantNameFr}` : ''}
                          {item.quantity} x {formatPrice(Number(item.unitPrice))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(Number(item.totalPrice))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatPrice(Number(order.deliveryFee))}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formatPrice(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Customer Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <a href={`mailto:${order.customerEmail}`} className="text-primary hover:underline">
                    {order.customerEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <a href={`tel:${order.customerPhone}`} className="text-gray-600 hover:text-gray-900">
                    {order.customerPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Delivery Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <p className="text-gray-600 leading-relaxed">
                {order.deliveryAddress}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.customerNotes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Customer Notes</h2>
              <p className="text-gray-600 italic">"{order.customerNotes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
