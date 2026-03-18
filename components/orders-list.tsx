'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Calendar, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface OrdersListProps {
  locale: string;
  orderNumber?: string;
  orders: OrderSummary[];
}

export function OrdersList({ locale, orderNumber, orders }: OrdersListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      PENDING: {
        ar: 'قيد الانتظار',
        fr: 'En attente',
        en: 'Pending',
      },
      CONFIRMED: {
        ar: 'مؤكد',
        fr: 'Confirmé',
        en: 'Confirmed',
      },
      DELIVERED: {
        ar: 'تم التسليم',
        fr: 'Livré',
        en: 'Delivered',
      },
      CANCELLED: {
        ar: 'ملغي',
        fr: 'Annulé',
        en: 'Cancelled',
      },
    };
    return statusMap[status]?.[locale] || status;
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-text-secondary text-lg mb-4">
          {locale === 'ar'
            ? 'لا توجد طلبات حتى الآن'
            : locale === 'fr'
              ? 'Aucune commande pour le moment'
              : 'No orders yet'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-4"
        >
          {locale === 'ar' ? 'تسوق الآن' : locale === 'fr' ? 'Acheter maintenant' : 'Shop Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.orderNumber} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-1">
                {locale === 'ar' ? 'رقم الطلب:' : locale === 'fr' ? 'Commande:' : 'Order:'} {order.orderNumber}
              </h3>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.createdAt).toLocaleDateString(locale)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-semibold">{getStatusText(order.status)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-text-secondary mb-2">
                  {locale === 'ar' ? 'المنتجات:' : locale === 'fr' ? 'Produits:' : 'Items:'} {order.items.length}
                </p>
                <div className="text-sm text-text-secondary">
                  {order.items.slice(0, 2).map((item, i) => (
                    <span key={i} className="block">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-xs opacity-75">
                      +{order.items.length - 2} {locale === 'ar' ? 'المزيد' : locale === 'fr' ? 'plus' : 'more'}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary mb-1">
                  {locale === 'ar' ? 'الإجمالي:' : locale === 'fr' ? 'Total:' : 'Total:'}
                </p>
                <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
              </div>
            </div>
            <Link
              href={`/${locale}/orders/${order.orderNumber}`}
              className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              {locale === 'ar' ? 'عرض التفاصيل' : locale === 'fr' ? 'Voir les détails' : 'View Details'} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}





