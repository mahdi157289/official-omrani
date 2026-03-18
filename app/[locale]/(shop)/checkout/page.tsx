import { getTranslations } from 'next-intl/server';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Suspense } from 'react';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('checkout');

  return (
    <main className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <Suspense fallback={<div className="text-center p-8">Loading checkout...</div>}>
        <CheckoutForm locale={locale} />
      </Suspense>
    </main>
  );
}
