import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import Link from 'next/link';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { addresses: true },
  });

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          {locale === 'ar' ? 'الملف الشخصي' : locale === 'fr' ? 'Mon Profil' : 'My Profile'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {locale === 'ar' ? 'المعلومات الشخصية' : locale === 'fr' ? 'Informations personnelles' : 'Personal Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {locale === 'ar' ? 'الاسم' : locale === 'fr' ? 'Nom' : 'Name'}
                </label>
                <p className="text-lg font-medium">{user.fullName || user.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'fr' ? 'Email' : 'Email'}
                </label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {locale === 'ar' ? 'رقم الهاتف' : locale === 'fr' ? 'Téléphone' : 'Phone'}
                </label>
                <p className="text-lg font-medium">{user.phone || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {locale === 'ar' ? 'اللغة المفضلة' : locale === 'fr' ? 'Langue préférée' : 'Preferred Language'}
                </label>
                <p className="text-lg font-medium uppercase">{user.preferredLanguage}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {locale === 'ar' ? 'روابط سريعة' : locale === 'fr' ? 'Liens rapides' : 'Quick Links'}
            </h2>
            <div className="space-y-4">
              <Link href={`/${locale}/orders`} className="block w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                <span className="font-medium">{locale === 'ar' ? 'طلباتي' : locale === 'fr' ? 'Mes commandes' : 'My Orders'}</span>
                <span className="text-primary">→</span>
              </Link>
              <Link href={`/${locale}/cart`} className="block w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                <span className="font-medium">{locale === 'ar' ? 'عربة التسوق' : locale === 'fr' ? 'Mon panier' : 'My Cart'}</span>
                <span className="text-primary">→</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link href={`/admin`} className="block w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center border-primary/20 bg-primary/5">
                  <span className="font-medium text-primary">{locale === 'ar' ? 'لوحة التحكم' : locale === 'fr' ? 'Panneau d\'administration' : 'Admin Panel'}</span>
                  <span className="text-primary">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
