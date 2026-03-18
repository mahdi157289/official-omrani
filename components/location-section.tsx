'use client';

import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import { SectionTitle } from './ui/section-title';
import { FadeIn } from './ui/fade-in';
import { useState } from 'react';

interface LocationSectionProps {
    locale: string;
}

const TUNIS_MAP_URL = 'https://www.google.com/maps/place/Makroud+Omrani+%D9%85%D9%82%D8%B1%D9%88%D8%B6+%D8%A7%D9%84%D8%B9%D9%85%D8%B1%D8%A7%D9%86%D9%8A+%D8%A7%D9%84%D8%B9%D9%88%D9%8A%D9%86%D8%A9%E2%80%AD/@36.8566883,10.2563914,17z';
const KAIROUAN_MAP_URL = 'https://www.google.com/maps/place/Makroudh+Omrani/@35.6694672,10.1016426,16z';

// Both pins embedded in one map view
const MAP_EMBED_BOTH = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d693497!2d10.18!3d36.26!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m3!3e0!4m0!4m0!5e0!3m2!1sfr!2stn!4v1709550000000!5m2!1sfr!2stn`;
const MAP_EMBED_TUNIS = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.7!2d10.25639!3d36.8566883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb00218c4a1b:0xd8662338f2e31105!2sMakroud%20Omrani!5e0!3m2!1sfr!2stn!4v1709550000000!5m2!1sfr!2stn`;
const MAP_EMBED_KAIROUAN = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.6!2d10.1042195!3d35.668865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fdc535e86d8aa9:0x4664648080ec0cd0!2sMakroudh%20Omrani!5e0!3m2!1sfr!2stn!4v1709550000000!5m2!1sfr!2stn`;

export function LocationSection({ locale }: LocationSectionProps) {
    const [activeMap, setActiveMap] = useState<'tunis' | 'kairouan'>('tunis');

    const t = (obj: Record<string, string>) => obj[locale] || obj['en'];

    return (
        <div className="container mx-auto px-4">
            <SectionTitle title={locale === 'ar' ? 'موقعنا' : locale === 'fr' ? 'Notre Emplacement' : 'Our Location'} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {/* Info Cards */}
                <div className="space-y-4">

                    {/* --- Location Selector --- */}
                    <FadeIn direction="right" delay={0.1}>
                        <div className="bg-[#F2C782] p-5 rounded-2xl shadow-md gold-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-primary/10 rounded-full">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-primary">
                                    {locale === 'ar' ? 'فروعنا' : locale === 'fr' ? 'Nos Adresses' : 'Our Branches'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Tunis Branch */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setActiveMap('tunis')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 font-semibold flex flex-col gap-1 group hover:shadow-md ${activeMap === 'tunis'
                                                ? 'border-primary bg-primary text-white shadow-lg scale-[1.02]'
                                                : 'border-primary/30 bg-white/60 text-black hover:border-primary hover:bg-white'
                                            }`}
                                    >
                                        <span className="text-base font-black">
                                            🏙️ {locale === 'ar' ? 'تونس العاصمة' : locale === 'fr' ? 'Tunis' : 'Tunis'}
                                        </span>
                                        <span className={`text-xs leading-relaxed ${activeMap === 'tunis' ? 'text-white/80' : 'text-gray-600'}`}>
                                            {locale === 'ar' ? 'العوينة' : 'L\'Aouina'}
                                        </span>
                                    </button>
                                    <a
                                        href={TUNIS_MAP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {locale === 'ar' ? 'فتح في خرائط جوجل' : 'Ouvrir dans Maps'}
                                    </a>
                                </div>

                                {/* Kairouan Branch */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setActiveMap('kairouan')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 font-semibold flex flex-col gap-1 group hover:shadow-md ${activeMap === 'kairouan'
                                                ? 'border-primary bg-primary text-white shadow-lg scale-[1.02]'
                                                : 'border-primary/30 bg-white/60 text-black hover:border-primary hover:bg-white'
                                            }`}
                                    >
                                        <span className="text-base font-black">
                                            🕌 {locale === 'ar' ? 'القيروان' : locale === 'fr' ? 'Kairouan' : 'Kairouan'}
                                        </span>
                                        <span className={`text-xs leading-relaxed ${activeMap === 'kairouan' ? 'text-white/80' : 'text-gray-600'}`}>
                                            {locale === 'ar' ? 'وسط المدينة' : 'Centre-ville'}
                                        </span>
                                    </button>
                                    <a
                                        href={KAIROUAN_MAP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {locale === 'ar' ? 'فتح في خرائط جوجل' : 'Ouvrir dans Maps'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Hours */}
                    <FadeIn direction="right" delay={0.2}>
                        <div className="bg-[#F2C782] p-5 rounded-2xl shadow-md gold-border hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-primary/10 rounded-full">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-primary">
                                    {locale === 'ar' ? 'ساعات العمل' : locale === 'fr' ? 'Horaires' : 'Working Hours'}
                                </h4>
                            </div>
                            <p className="text-black text-lg font-semibold">
                                {locale === 'ar' ? 'يومياً: 8:00 صباحاً - 11:00 مساءً' : locale === 'fr' ? 'Tous les jours: 08:00 – 23:00' : 'Daily: 08:00 AM – 11:00 PM'}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Contact */}
                    <FadeIn direction="right" delay={0.3}>
                        <div className="bg-[#F2C782] p-5 rounded-2xl shadow-md gold-border hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-primary/10 rounded-full">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-primary">
                                    {locale === 'ar' ? 'اتصل بنا' : locale === 'fr' ? 'Contact' : 'Contact Us'}
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <a href="tel:+21694700009" className="flex items-center gap-2 text-black text-lg hover:text-primary transition-colors font-semibold">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    94 700 009
                                </a>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Map - switches based on active branch */}
                <div className="lg:col-span-2 flex flex-col">
                    <FadeIn direction="up" delay={0.4} className="flex-grow">
                        <div className="h-full min-h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl gold-border relative group">
                            {/* Map toggles at top */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                                <button
                                    onClick={() => setActiveMap('tunis')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeMap === 'tunis' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    🏙️ Tunis
                                </button>
                                <button
                                    onClick={() => setActiveMap('kairouan')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeMap === 'kairouan' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    🕌 Kairouan
                                </button>
                            </div>

                            <iframe
                                key={activeMap}
                                src={activeMap === 'tunis' ? MAP_EMBED_TUNIS : MAP_EMBED_KAIROUAN}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                title={`Google Maps - ${activeMap === 'tunis' ? 'Tunis' : 'Kairouan'}`}
                                className="filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/5 rounded-2xl" />

                            {/* Open in Maps overlay link */}
                            <a
                                href={activeMap === 'tunis' ? TUNIS_MAP_URL : KAIROUAN_MAP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all pointer-events-auto"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {locale === 'ar' ? 'فتح الخرائط' : 'Ouvrir Maps'}
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
