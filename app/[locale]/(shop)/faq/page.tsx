import { LanguageSwitcher } from '@/components/language-switcher';
import { FAQList } from '@/components/faq-list';

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-16">
        <h1 className="text-4xl font-bold text-primary mb-12 text-center">
          {locale === 'ar' ? 'الأسئلة الشائعة' : locale === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions'}
        </h1>

        <FAQList locale={locale} />
      </div>
    </main>
  );
}





