'use client';

import { useState } from 'react';
import { useCart } from '@/components/providers/cart-provider';
import { X } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function OrderModal({ isOpen, onClose, locale }: OrderModalProps) {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock order submission
    // In a real app, send to /api/orders
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'ar' ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­!' : locale === 'fr' ? 'Commande reÃ§ue avec succÃ¨s !' : 'Order Received Successfully!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'ar'
              ? 'Ø´ÙƒØ±Ø§Ù‹ Ù„ØªØ³ÙˆÙ‚Ùƒ Ù…Ø¹Ù†Ø§. Ø³Ù†ØªØµÙ„ Ø¨Ùƒ Ù‚Ø±ÙŠØ¨Ø§Ù‹ Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨.'
              : locale === 'fr'
                ? 'Merci de votre achat. Nous vous contacterons bientÃ´t pour confirmer.'
                : 'Thank you for shopping with us. We will contact you shortly to confirm.'}
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            {locale === 'ar' ? 'Ø¥ØºÙ„Ø§Ù‚' : locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {locale === 'ar' ? 'Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø·Ù„Ø¨' : locale === 'fr' ? 'Finaliser la commande' : 'Complete Order'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'ar' ? 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„' : locale === 'fr' ? 'Nom complet' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black bg-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'ar' ? 'Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ' : locale === 'fr' ? 'NumÃ©ro de tÃ©lÃ©phone' : 'Phone Number'}
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black bg-white"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'ar' ? 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ' : locale === 'fr' ? 'Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black bg-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'ar' ? 'Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©' : locale === 'fr' ? 'Ville' : 'City'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'ar' ? 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù†' : locale === 'fr' ? 'Adresse' : 'Address'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black bg-white"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>{locale === 'ar' ? 'Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹' : locale === 'fr' ? 'Total' : 'Total'}</span>
              <span>{total.toFixed(2)} TND</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <CoinLoader className="w-5 h-5 animate-spin" wrapperClassName="contents" />
                {locale === 'ar' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©...' : locale === 'fr' ? 'Traitement...' : 'Processing...'}
              </>
            ) : (
              locale === 'ar' ? 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨' : locale === 'fr' ? 'Confirmer la commande' : 'Confirm Order'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
