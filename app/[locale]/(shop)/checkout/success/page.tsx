import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId: string }>;
}) {
  const { locale } = await params;
  const { orderId } = await searchParams;
  const t = await getTranslations('checkout');

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <CheckCircle className="w-24 h-24 text-green-500" />
        <h1 className="text-4xl font-bold text-gray-900">{t('successTitle')}</h1>
        <p className="text-xl text-gray-600">
          {t('successMessage')} <span className="font-bold">#{orderId}</span>
        </p>
        <p className="text-gray-500 max-w-md mx-auto">
          {t('confirmationSent')}
        </p>
        <div className="pt-8">
          <Link
            href={`/${locale}/shop`}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </main>
  );
}
