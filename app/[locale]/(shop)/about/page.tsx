import { LanguageSwitcher } from '@/components/language-switcher';
import Image from 'next/image';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1920&q=80"
            alt={locale === 'ar' ? 'من نحن' : locale === 'fr' ? 'À propos' : 'About Us'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {locale === 'ar' ? 'من نحن' : locale === 'fr' ? 'À propos' : 'About Us'}
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
                  alt={locale === 'ar' ? 'مقروض تقليدي' : locale === 'fr' ? 'Makroudh traditionnel' : 'Traditional makroudh'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80"
                  alt={locale === 'ar' ? 'صناعة تقليدية' : locale === 'fr' ? 'Fabrication traditionnelle' : 'Traditional preparation'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-primary mb-6">
                {locale === 'ar' ? 'قصتنا' : locale === 'fr' ? 'Notre histoire' : 'Our Story'}
              </h2>
              <p className="text-text-secondary text-lg mb-4 leading-relaxed">
                {locale === 'ar'
                  ? 'مقروض العمراني هو مشروع عائلي بدأ منذ سنوات عديدة، متخصص في صناعة المقروض التونسي الأصيل بوصفة جداتنا التي تم تناقلها عبر الأجيال. نحن نؤمن بأن الطعم الأصيل يأتي من المكونات الطبيعية والطرق التقليدية في التحضير.'
                  : locale === 'fr'
                    ? 'Makroudh Omrani est un projet familial qui a commencé il y a de nombreuses années, spécialisé dans la fabrication de makroudh tunisien authentique selon la recette de nos grands-mères transmise de génération en génération. Nous croyons que le goût authentique vient des ingrédients naturels et des méthodes traditionnelles de préparation.'
                    : 'Makroudh Omrani is a family project that started many years ago, specializing in making authentic Tunisian makroudh using our grandmothers\' recipe that has been passed down through generations. We believe that authentic taste comes from natural ingredients and traditional preparation methods.'}
              </p>
              <p className="text-text-secondary text-lg mb-4 leading-relaxed">
                {locale === 'ar'
                  ? 'نستخدم أجود المكونات الطبيعية - الدقيق الأبيض، التمر، اللوز، السمن البلدي - ونحافظ على الطرق التقليدية في العجن والتحضير. كل قطعة مقروض تُصنع بحب وعناية، لتقديم تجربة طعم فريدة لعملائنا.'
                  : locale === 'fr'
                    ? 'Nous utilisons les meilleurs ingrédients naturels - farine blanche, dattes, amandes, beurre clarifié - et préservons les méthodes traditionnelles de pétrissage et de préparation. Chaque morceau de makroudh est fait avec amour et soin, pour offrir une expérience gustative unique à nos clients.'
                    : 'We use the finest natural ingredients - white flour, dates, almonds, clarified butter - and preserve traditional kneading and preparation methods. Every piece of makroudh is made with love and care, to offer a unique taste experience to our customers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-cream/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            {locale === 'ar' ? 'قيمنا' : locale === 'fr' ? 'Nos valeurs' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {locale === 'ar' ? 'الجودة' : locale === 'fr' ? 'Qualité' : 'Quality'}
              </h3>
              <p className="text-text-secondary">
                {locale === 'ar'
                  ? 'نلتزم بأعلى معايير الجودة في كل منتج'
                  : locale === 'fr'
                    ? 'Nous nous engageons aux plus hauts standards de qualité dans chaque produit'
                    : 'We commit to the highest quality standards in every product'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {locale === 'ar' ? 'الطازجة' : locale === 'fr' ? 'Fraîcheur' : 'Freshness'}
              </h3>
              <p className="text-text-secondary">
                {locale === 'ar'
                  ? 'نحضر كل شيء طازجاً يومياً'
                  : locale === 'fr'
                    ? 'Nous préparons tout frais quotidiennement'
                    : 'We prepare everything fresh daily'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {locale === 'ar' ? 'الحب' : locale === 'fr' ? 'Passion' : 'Passion'}
              </h3>
              <p className="text-text-secondary">
                {locale === 'ar'
                  ? 'نصنع كل منتج بحب واهتمام'
                  : locale === 'fr'
                    ? 'Nous fabriquons chaque produit avec amour et attention'
                    : 'We make every product with love and care'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}






