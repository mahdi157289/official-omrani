'use client';

import React, { useEffect, useState } from 'react';
import { useUI } from '@/components/providers/ui-provider';
import { SplashScreen } from '@/components/splash-screen';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { LanguageSwitcher } from '@/components/language-switcher';
import { FloatingCart } from '@/components/floating-cart';
import { FloatingPhone } from '@/components/floating-phone';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { usePathname } from 'next/navigation';

export function ClientLayout({
    children,
    locale,
    isAdmin
}: {
    children: React.ReactNode;
    locale: string;
    isAdmin: boolean;
}) {
    // All hooks must be called unconditionally at the top level - React rules
    const { introFinished, isMounted: isMountedUI } = useUI();
    const pathname = usePathname();
    // Initialize mounted to true on client to avoid initial render issues
    const [mounted, setMounted] = useState(typeof window !== 'undefined');
    
    useEffect(() => {
        // Ensure mounted is set on client
        if (typeof window !== 'undefined' && !mounted) {
            setMounted(true);
        }
    }, [mounted]);

    useEffect(() => {
        // Initialization side effects can be added here
    }, [locale, isAdmin, mounted, isMountedUI]);

    // Accurate check for admin routes (including locale prefixes like /ar/admin)
    const isActuallyAdmin = pathname?.match(/\/(ar|fr|en)?\/?admin/);

    // Wait for component to be mounted on client and UI context to be ready
    if (!mounted || !isMountedUI) {
        return (
            <div 
                lang={locale} 
                dir={locale === 'ar' ? 'rtl' : 'ltr'} 
                className="min-h-screen bg-background"
                style={{ backgroundColor: '#00353F' }}
            >
                {children}
            </div>
        );
    }

    return (
        <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
            {/* 
              persistent shop components. 
              They persist even on admin routes so WebGL state isn't lost, 
              but they are visually hidden via CSS.
            */}
            <div className={isActuallyAdmin ? 'hidden' : 'block'}>
                <SplashScreen />

                <div
                    style={{
                        opacity: introFinished ? 1 : 0,
                        pointerEvents: introFinished ? 'auto' : 'none',
                        transition: 'opacity 0.5s ease',
                    }}
                >
                    <Navigation />
                    {!isActuallyAdmin && <main className="relative z-10">{children}</main>}
                    {!isActuallyAdmin && <Footer />}
                </div>

                {introFinished && !isActuallyAdmin && (
                    <>
                        <CartSidebar locale={locale} />
                        <LanguageSwitcher />
                        <FloatingCart />
                        <FloatingPhone />
                    </>
                )}
            </div>

            {/* Admin Layout Rendering */}
            {isActuallyAdmin && (
                <div className="admin-root-container">
                    {children}
                </div>
            )}
        </div>
    );
}

export default ClientLayout;
