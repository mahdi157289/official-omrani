'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingCart, Menu, User, LogOut, Package, UserCircle, ShieldCheck, Facebook, Instagram, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchBar } from './search-bar';
import { useSession, signOut } from 'next-auth/react';
import { Lantern3D, ParticleGlow } from './lantern-3d';
// Removed Logo3D import - using 2D circular logo instead
import { DecoSeparator } from './ui/deco-separator';
import { useUI } from './providers/ui-provider';

interface NavLinkProps {
  id: string;
  label: string;
  activeSection: string;
  locale: string;
  pathname: string;
  scrollToSection: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const NavLink = ({ id, label, activeSection, locale, pathname, scrollToSection }: NavLinkProps) => {
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isActive = isHomePage && activeSection === id;

  return (
    <a
      href={isHomePage ? `#${id}` : `/${locale}#${id}`}
      onClick={(e) => scrollToSection(e, id)}
      className={`text-white hover:text-[#D4AF37] transition-all duration-300 font-medium text-lg relative group cursor-pointer ${isActive ? 'text-[#D4AF37]' : ''
        }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37] transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}></span>
    </a>
  );
};

export function Navigation() {
  const locale = useLocale();
  const t = useTranslations('common');
  const pathname = usePathname() || '';
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { show3DItems, introFinished, isMounted } = useUI();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['home', 'featured', 'packages', 'location'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 100; // navbar height + buffer
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setActiveSection(id);
      }
    } else {
      router.push(`/${locale}#${id}`);
    }
  };


  return (
    <>
      {/* Sticky Social Icons - Desktop */}
      <div className="fixed top-8 left-6 z-[60] hidden lg:block">
        <motion.a
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          href="https://www.facebook.com/makroudhomrani"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-[#437983] hover:bg-[#F2C782] border-2 border-[#D4AF37]/30 text-white hover:text-[#437983] shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </motion.a>
      </div>

      <div className="fixed top-8 right-6 z-[60] hidden lg:block">
        <motion.a
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          href="https://www.instagram.com/makroudhomrani"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-[#437983] hover:bg-[#F2C782] border-2 border-[#D4AF37]/30 text-white hover:text-[#437983] shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </motion.a>
      </div>

      <nav
        className="fixed top-4 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-[#437983] shadow-2xl w-[88%] max-w-6xl mx-auto rounded-3xl border border-white/10"
      >
        {/* Hanging 3D Objects */}
        <div
          className={`absolute top-0 left-0 w-full h-[300px] pointer-events-none overflow-hidden z-0 transition-all duration-1000 ease-in-out ${show3DItems && introFinished ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-[-20px]'
            }`}
        >
          {/* Background Glow Particles */}
          <ParticleGlow />

          {/* Left - New Deco */}
          <div className="absolute left-4 md:left-12 -top-[22px] w-28 md:w-36 h-36 flex items-center justify-center">
            <Lantern3D model="new" interactive={false} className="w-full h-full" />
          </div>

          {/* Center - Lantern */}
          <div className="absolute left-1/2 -translate-x-1/2 top-14 w-28 md:w-44 h-[240px] md:h-[360px] z-0">
            <Lantern3D model="lantern" interactive={false} className="w-full h-full" />
          </div>

          {/* Right - Ramadan Deco */}
          <div className="absolute right-4 md:right-12 -top-12 w-20 md:w-28 h-[200px] md:h-[300px]">
            <div className="w-full h-full">
              <Lantern3D model="ramadan" interactive={false} className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between h-28 relative">

            {/* Mobile Menu Button - Left */}
            <div className="md:hidden flex items-center z-20">
              <button
                className="p-2 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="w-8 h-8" />
              </button>
            </div>

            {/* Mobile Center Logo */}
            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <Link href={`/${locale}`} className="flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="relative w-[80px] h-[80px] rounded-full border-2 border-[#D4AF37] shadow-lg overflow-hidden p-0">
                  <Image
                    src="/media/logo.png"
                    alt="Makroudh Omrani"
                    fill
                    className="object-cover rounded-full p-0"
                    priority
                    sizes="80px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered Logo Layout */}
            <div className="hidden md:flex items-center justify-center flex-1">

              {/* Left Links */}
              <div className="flex-1 flex items-center justify-end gap-12 pr-8">
                <Link
                  href={`/${locale}/shop`}
                  className={`text-white hover:text-[#D4AF37] transition-all duration-300 font-medium text-lg relative group cursor-pointer ${pathname === `/${locale}/shop` ? 'text-[#D4AF37]' : ''
                    }`}
                >
                  {t('shop')}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37] transform origin-left transition-transform duration-300 ${pathname === `/${locale}/shop` ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </Link>
                <Link
                  href={`/${locale}/shop?type=product`}
                  className={`text-white hover:text-[#D4AF37] transition-all duration-300 font-medium text-lg relative group cursor-pointer ${pathname.includes('type=product') ? 'text-[#D4AF37]' : ''
                    }`}
                >
                  {t('products')}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37] transform origin-left transition-transform duration-300 ${pathname.includes('type=product') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </Link>
              </div>

              {/* Center Logo */}
              <Link href={`/${locale}`} className="flex-none flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 mx-4 group">
                <motion.div
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 1.5
                  }}
                  className="relative w-[120px] h-[120px] z-50 rounded-full border-[3px] border-[#D4AF37] shadow-xl overflow-hidden p-0 group-hover:border-[#F2C782] transition-all duration-300"
                >
                  <Image
                    src="/media/logo.png"
                    alt="Makroudh Omrani"
                    fill
                    className="object-cover rounded-full p-0"
                    priority
                    sizes="120px"
                  />
                </motion.div>
                <div className="-mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <DecoSeparator />
                </div>
              </Link>

              {/* Right Links */}
              <div className="flex-1 flex items-center justify-start gap-12 pl-8">
                <Link
                  href={`/${locale}/shop?type=package`}
                  className={`text-white hover:text-[#D4AF37] transition-all duration-300 font-medium text-lg relative group cursor-pointer ${pathname.includes('type=package') ? 'text-[#D4AF37]' : ''
                    }`}
                >
                  {t('packages')}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37] transform origin-left transition-transform duration-300 ${pathname.includes('type=package') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </Link>
                <NavLink
                  id="location"
                  label={t('location')}
                  activeSection={activeSection}
                  locale={locale}
                  pathname={pathname}
                  scrollToSection={scrollToSection}
                />
              </div>
            </div>

            {/* Right Icons (Socials, Search, Cart, User) */}
            <div className="flex items-center gap-3 lg:gap-4 md:absolute md:right-0 z-20">


              {/* User Menu - Desktop Only */}
              <div className="hidden md:flex items-center gap-2">
                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 text-white hover:text-primary transition-colors font-medium"
                    >
                      <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors gold-border glare-effect">
                        <UserCircle className="w-6 h-6" />
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div className={`absolute top-full mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 ${locale === 'ar' ? 'left-0' : 'right-0'}`}>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle className="w-4 h-4" />
                          {t('profile')}
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className="flex items-center gap-2 text-white hover:text-primary transition-colors font-medium"
                  >
                    <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors gold-border glare-effect">
                      <UserCircle className="w-6 h-6" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <Link
                href={`/${locale}/shop`}
                className="block py-2 text-white hover:text-[#D4AF37]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('shop')}
              </Link>
              <Link
                href={`/${locale}/shop?type=product`}
                className="block py-2 text-white hover:text-[#D4AF37]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('products')}
              </Link>
              <Link
                href={`/${locale}/shop?type=package`}
                className="block py-2 text-white hover:text-[#D4AF37]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('packages')}
              </Link>
              <Link
                href={`/${locale}#location`}
                className="block py-2 text-white hover:text-[#D4AF37]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('location')}
              </Link>

              <div className="border-t border-white/10 my-2 pt-2">
                {session ? (
                  <>
                    <div className="py-2 font-semibold text-primary">{session.user?.name}</div>
                    <Link
                      href={`/${locale}/profile`}
                      className="block py-2 text-white hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <Link
                      href={`/${locale}/orders`}
                      className="block py-2 text-white hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('orders')}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-start py-2 text-red-600 hover:text-red-700"
                    >
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className="block py-2 text-primary font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('loginButton')}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
