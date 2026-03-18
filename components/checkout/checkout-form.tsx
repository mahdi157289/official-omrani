'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function CheckoutForm({ locale }: { locale: string }) {
  const t = useTranslations('checkout');
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get('canceled') === 'true';

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    // Fetch cart
    fetch(`/api/cart?sessionId=default&locale=${locale}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cart));
  }, [locale]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = 7.00; // Fixed fee for now
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
          customer: formData,
          total,
          deliveryFee,
          sessionId: 'default', // In production, this would be tied to auth or cookie
          paymentMethod: 'STRIPE',
        }),
      });

      if (response.ok) {
        const order = await response.json();
        
        // Process Stripe Payment
        const stripeRes = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (stripeRes.ok) {
          const { url } = await stripeRes.json();
          window.location.href = url; // Redirect to Stripe
        } else {
          console.error('Failed to create stripe session');
          alert(t('error') || 'Stripe error');
          setLoading(false);
        }
      } else {
        alert(t('error'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-8">{t('emptyCart')}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        {isCanceled && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {locale === 'ar' ? 'تم إلغاء عملية الدفع، يمكنك المحاولة مرة أخرى.' : locale === 'fr' ? 'Le paiement a été annulé, vous pouvez réessayer.' : 'Payment was canceled, you can try again.'}
          </div>
        )}
        <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold mb-4">{t('shippingDetails')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-black bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-black bg-white"
            />
          </div>
        </form>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
          <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} x {item.quantity}</span>
                <span>{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('delivery')}</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>{t('total')}</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-6 hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? t('processing') : t('placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
