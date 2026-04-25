'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, MapPin, Package, Clock, CheckCircle, RefreshCw } from 'lucide-react';

interface PendingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  deliveryAddress: string | null;
  totalAmount: number | string | { toNumber: () => number };
  createdAt: string;
  customerNotes: string | null;
}

function getAmount(val: any): string {
  const num = typeof val === 'object' && val?.toNumber ? val.toNumber() : Number(val) || 0;
  return `${num.toFixed(3)} DT`;
}

export function AdminPendingOrdersPanel() {
  const locale = useLocale();
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pending-orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setCount(data.count || 0);
        setLastUpdated(new Date());
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const markDelivered = async (orderId: string) => {
    setMarking(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' }),
      });
      await fetchOrders();
    } catch (_) {}
    setMarking(null);
  };

  if (loading) return null;
  if (count === 0) return null;

  return (
    <div className="mb-8 bg-orange-50 border-2 border-orange-300 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-white text-orange-600 rounded-full flex items-center justify-center font-black text-sm animate-pulse">
            {count}
          </span>
          <h2 className="text-white font-bold text-lg">
            {locale === 'ar' ? 'طلبيات جديدة بانتظار التأكيد' : locale === 'fr' ? 'Nouvelles commandes en attente' : 'New Pending Orders'}
          </h2>
        </div>
        <button
          onClick={fetchOrders}
          className="text-white opacity-80 hover:opacity-100 transition-opacity p-1"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders list */}
      <div className="divide-y divide-orange-200">
        {orders.map((order) => (
          <div key={order.id} className="p-5 hover:bg-orange-100/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 space-y-2">
                {/* Order number + time */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-black text-orange-700 text-sm">#{order.orderNumber}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString(locale === 'ar' ? 'ar-TN' : locale === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-TN' : locale === 'fr' ? 'fr-FR' : 'en-GB')}
                  </span>
                  <span className="ml-auto font-bold text-orange-800 text-sm">
                    {getAmount(order.totalAmount)}
                  </span>
                </div>

                {/* Customer info */}
                <div className="flex flex-wrap gap-3 text-sm">
                  {/* Name */}
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-orange-200 shadow-sm">
                    <span className="text-[10px] uppercase font-black text-orange-400">
                      {locale === 'ar' ? 'الاسم' : locale === 'fr' ? 'Nom' : 'Name'}
                    </span>
                    <span className="font-bold text-gray-900">{order.customerName}</span>
                  </div>

                  {/* Phone */}
                  {order.customerPhone && (
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      <span className="text-[10px] uppercase font-black text-blue-400">
                        {locale === 'ar' ? 'هاتف' : locale === 'fr' ? 'Tél' : 'Phone'}
                      </span>
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-blue-700">{order.customerPhone}</span>
                    </a>
                  )}

                  {/* Address */}
                  {order.deliveryAddress && (
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                      <span className="text-[10px] uppercase font-black text-amber-400">
                        {locale === 'ar' ? 'العنوان' : locale === 'fr' ? 'Adr' : 'Addr'}
                      </span>
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-bold text-amber-800">{order.deliveryAddress}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {order.customerNotes && (
                  <p className="text-xs text-gray-500 italic pl-5">
                    📝 {order.customerNotes}
                  </p>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => markDelivered(order.id)}
                disabled={marking === order.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap shadow"
              >
                <CheckCircle className="w-4 h-4" />
                {marking === order.id
                  ? '...'
                  : locale === 'ar' ? 'تم التسليم' : locale === 'fr' ? 'Livré' : 'Mark Delivered'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="px-6 py-2 text-xs text-orange-400 text-end border-t border-orange-200">
          {locale === 'ar' ? 'آخر تحديث:' : locale === 'fr' ? 'Mis à jour:' : 'Updated:'} {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
