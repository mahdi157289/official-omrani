import Link from 'next/link';
import { CheckCircle, Truck, Phone } from 'lucide-react';

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId: string }>;
}) {
  const { locale } = await params;
  const { orderId } = await searchParams;

  const messages = {
    ar: {
      title: 'تم تأكيد طلبك! 🎉',
      orderNum: 'رقم الطلب',
      cod: 'الدفع عند الاستلام',
      codDesc: 'لا داعي للدفع الآن. ادفع نقداً عند استلام طلبك.',
      contact: 'سنتصل بك قريباً لتأكيد موعد التسليم.',
      thanks: 'شكراً لثقتك في مقروض عمراني!',
      continue: 'مواصلة التسوق',
    },
    fr: {
      title: 'Commande confirmée! 🎉',
      orderNum: 'Numéro de commande',
      cod: 'Paiement à la livraison',
      codDesc: 'Pas besoin de payer maintenant. Payez en espèces à la livraison.',
      contact: 'Nous vous contacterons bientôt pour confirmer l\'heure de livraison.',
      thanks: 'Merci de votre confiance en Makroudh Omrani!',
      continue: 'Continuer vos achats',
    },
    en: {
      title: 'Order Confirmed! 🎉',
      orderNum: 'Order Number',
      cod: 'Cash on Delivery',
      codDesc: 'No payment needed now. Pay cash when your order arrives.',
      contact: 'We will contact you soon to confirm the delivery time.',
      thanks: 'Thank you for choosing Makroudh Omrani!',
      continue: 'Continue Shopping',
    },
  };

  const m = messages[locale as keyof typeof messages] || messages.en;

  return (
    <main className="container mx-auto px-4 pt-40 pb-16">
      <div className="max-w-lg mx-auto text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900">{m.title}</h1>

        {/* Order Number */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-sm text-gray-500 mb-1">{m.orderNum}</p>
          <p className="text-2xl font-black text-primary tracking-wider">#{orderId}</p>
        </div>

        {/* COD Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-amber-800">{m.cod}</span>
          </div>
          <p className="text-amber-700 text-sm">{m.codDesc}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <Phone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700 text-sm text-left">{m.contact}</p>
        </div>

        <p className="text-gray-500 text-sm">{m.thanks}</p>

        {/* CTA */}
        <div className="pt-4">
          <Link
            href={`/${locale}/shop`}
            className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg"
          >
            {m.continue}
          </Link>
        </div>
      </div>
    </main>
  );
}
