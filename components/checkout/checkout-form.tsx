'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';
import { ShoppingBag, Phone, MapPin, User, Truck } from 'lucide-react';

export function CheckoutForm({ locale }: { locale: string }) {
  const t = useTranslations('checkout');
  const { data: session } = useSession();
  const { formatPrice } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get('canceled') === 'true';

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    fetch(`/api/cart?sessionId=default&locale=${locale}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cart || []));
  }, [locale]);

  // Prefill name from session
  useEffect(() => {
    if (session?.user?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: session.user!.name || '' }));
    }
  }, [session]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = 7.0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customer: {
            name: formData.name,
            email: session?.user?.email || 'guest@makroudhomrani.tn',
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            notes: formData.notes,
          },
          total,
          deliveryFee,
          sessionId: 'default',
          paymentMethod: 'CASH_ON_DELIVERY',
        }),
      });

      if (response.ok) {
        const order = await response.json();
        router.push(`/${locale}/checkout/success?orderId=${order.orderNumber}`);
      } else {
        alert(t('error'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert(t('error'));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{t('emptyCart')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        {isCanceled && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200">
            {locale === 'ar'
              ? 'تم إلغاء العملية، يمكنك المحاولة مرة أخرى.'
              : locale === 'fr'
              ? 'Commande annulée, vous pouvez réessayer.'
              : 'Order was canceled, you can try again.'}
          </div>
        )}

        {/* COD Banner */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Truck className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 font-medium text-sm">
            {locale === 'ar'
              ? '💰 الدفع عند الاستلام — لا حاجة لبطاقة بنكية'
              : locale === 'fr'
              ? '💰 Paiement à la livraison — aucune carte bancaire requise'
              : '💰 Cash on Delivery — no bank card required'}
          </p>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <h2 className="text-xl font-bold mb-2 text-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t('shippingDetails')}
          </h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              {t('fullName')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={locale === 'ar' ? 'الاسم الكامل' : locale === 'fr' ? 'Nom complet' : 'Full name'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              {t('phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={locale === 'ar' ? 'مثال: 25123456' : 'Ex: 25 123 456'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('address')} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder={locale === 'ar' ? 'الشارع، الحي' : locale === 'fr' ? 'Rue, quartier' : 'Street, district'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('city')} *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder={locale === 'ar' ? 'المدينة' : locale === 'fr' ? 'Ville' : 'City'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder={locale === 'ar' ? 'أي ملاحظات إضافية؟' : locale === 'fr' ? 'Notes supplémentaires?' : 'Any additional notes?'}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24 text-black">
          <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t('orderSummary')}
          </h2>

          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm font-medium text-gray-800">
                <span className="flex-1 pr-2">{item.productName} × {item.quantity}</span>
                <span className="font-semibold text-gray-900 whitespace-nowrap">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between font-semibold text-gray-600">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600">
              <span>{t('delivery')}</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t text-black">
              <span>{t('total')}</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* COD note */}
          <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-green-700 text-xs font-semibold">
              {locale === 'ar' ? '💵 الدفع نقداً عند التسليم' : locale === 'fr' ? '💵 Paiement en espèces à la livraison' : '💵 Pay cash on delivery'}
            </p>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-6 hover:bg-primary-dark transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 text-lg shadow-lg"
          >
            {loading
              ? t('processing')
              : (locale === 'ar' ? '✓ تأكيد الطلب' : locale === 'fr' ? '✓ Confirmer la commande' : '✓ Confirm Order')}
          </button>
        </div>
      </div>
    </div>
  );
}
