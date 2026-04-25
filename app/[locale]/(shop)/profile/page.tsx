import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { User, Mail, Phone, Globe, ShoppingBag, ShoppingCart, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

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
  });

  if (!user) return null;

  const t = {
    ar: {
      title: 'الملف الشخصي',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      language: 'اللغة المفضلة',
      quickLinks: 'روابط سريعة',
      myOrders: 'طلباتي',
      myCart: 'عربة التسوق',
      adminPanel: 'لوحة التحكم',
    },
    fr: {
      title: 'Mon Profil',
      personalInfo: 'Informations Personnelles',
      name: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      language: 'Langue préférée',
      quickLinks: 'Liens Rapides',
      myOrders: 'Mes Commandes',
      myCart: 'Mon Panier',
      adminPanel: 'Panneau Admin',
    },
    en: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      language: 'Preferred Language',
      quickLinks: 'Quick Links',
      myOrders: 'My Orders',
      myCart: 'My Cart',
      adminPanel: 'Admin Panel',
    }
  }[locale as 'ar' | 'fr' | 'en'] || {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    language: 'Preferred Language',
    quickLinks: 'Quick Links',
    myOrders: 'My Orders',
    myCart: 'My Cart',
    adminPanel: 'Admin Panel',
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="w-[95%] max-w-5xl mx-auto pt-40 pb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-sm">
             <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {t.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
              
              <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                 <Shield className="w-6 h-6 text-primary" />
                 {t.personalInfo}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <InfoItem 
                  icon={<User className="w-5 h-5" />} 
                  label={t.name} 
                  value={user.fullName || user.firstName} 
                />
                <InfoItem 
                  icon={<Mail className="w-5 h-5" />} 
                  label={t.email} 
                  value={user.email} 
                />
                <InfoItem 
                  icon={<Phone className="w-5 h-5" />} 
                  label={t.phone} 
                  value={user.phone || '-'} 
                />
                <InfoItem 
                  icon={<Globe className="w-5 h-5" />} 
                  label={t.language} 
                  value={user.preferredLanguage?.toUpperCase() || locale.toUpperCase()} 
                />
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 px-4 mb-2 flex items-center gap-2">
               {t.quickLinks}
            </h2>
            
            <div className="space-y-3">
              <ProfileLink 
                href={`/${locale}/orders`} 
                icon={<ShoppingBag className="w-5 h-5" />} 
                label={t.myOrders} 
              />
              <ProfileLink 
                href={`/${locale}/cart`} 
                icon={<ShoppingCart className="w-5 h-5" />} 
                label={t.myCart} 
              />
              
              {user.role === 'ADMIN' && (
                <Link 
                  href={`/admin`} 
                  className="flex items-center justify-between p-5 bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary text-white rounded-xl shadow-md group-hover:rotate-6 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-primary text-lg">{t.adminPanel}</span>
                   </div>
                   <ArrowRight className={`w-5 h-5 text-primary transition-transform ${locale === 'ar' ? 'rotate-180' : ''} group-hover:translate-x-1`} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null }) {
  return (
    <div className="space-y-2 group/item">
      <div className="flex items-center gap-2 text-gray-500 font-bold text-sm tracking-wide uppercase">
        <span className="text-primary/60 group-hover/item:text-primary transition-colors">{icon}</span>
        {label}
      </div>
      <p className="text-xl font-bold text-gray-900 bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-primary/10 hover:bg-white transition-all shadow-sm">
        {value}
      </p>
    </div>
  );
}

function ProfileLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary rounded-xl transition-all">
          {icon}
        </div>
        <span className="font-bold text-gray-800 text-lg">{label}</span>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
    </Link>
  );
}
