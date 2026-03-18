import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { SessionProvider } from '@/components/providers/session-provider';
import { UIProvider } from '@/components/providers/ui-provider';
import { ClientLayoutWrapper } from '@/components/client-layout-wrapper';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <SessionProvider>
            <NextIntlClientProvider messages={messages}>
                <UIProvider>
                    <ClientLayoutWrapper locale={locale} isAdmin={false}>
                        {children}
                    </ClientLayoutWrapper>
                </UIProvider>
            </NextIntlClientProvider>
        </SessionProvider>
    );
}
