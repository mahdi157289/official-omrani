import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ContactForm } from '@/components/contact-form';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('common');

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-16">
        <h1 className="text-4xl font-bold text-primary mb-12 text-center">
          {t('contactUs')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              {t('sendMessage')}
            </h2>
            <ContactForm locale={locale} />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              {t('contactInfo')}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('address')}
                  </h3>
                  <p className="text-text-secondary">
                    {t('locationValue')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('phone')}
                  </h3>
                  <a href="tel:+21694700009" className="text-primary hover:underline">
                    +216 94 700 009
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('email')}
                  </h3>
                  <a href="mailto:info@makroudhomrani.tn" className="text-primary hover:underline">
                    info@makroudhomrani.tn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('businessHours')}
                  </h3>
                  <p className="text-text-secondary">
                    {t('hoursWeek')}
                  </p>
                  <p className="text-text-secondary">
                    {t('hoursFriday')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}





