import { getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/register-form';
import { LanguageSwitcher } from '@/components/language-switcher';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('auth');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('registerTitle')}
          </h1>
          <p className="text-text-secondary">
            {t('registerSubtitle')}
          </p>
        </div>

        <RegisterForm locale={locale} />

        <div className="mt-6 text-center text-sm text-text-secondary">
          {t('hasAccount')}{' '}
          <a href={`/${locale}/login`} className="text-primary hover:underline font-semibold">
            {t('loginLink')}
          </a>
        </div>
      </div>
    </main>
  );
}
