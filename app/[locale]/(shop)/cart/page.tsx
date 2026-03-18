import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CartItems } from '@/components/cart-items';

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('common');

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          {t('cart')}
        </h1>

        <CartItems locale={locale} />
      </div>
    </main>
  );
}






