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
        // #region agent log (avoid render-time side effects)
        if (typeof window !== 'undefined' && typeof fetch === 'function') {
            const browserInfo = typeof navigator !== 'undefined' ? {
                isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
                isEdge: /Edg/.test(navigator.userAgent),
                chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
            } : {};
            fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: 'client-layout.tsx:useEffect',
                    message: 'ClientLayout mounted',
                    data: {
                        locale,
                        isAdmin,
                        mounted,
                        isMountedUI,
                        hasWindow: typeof window !== 'undefined',
                        hasDocument: typeof document !== 'undefined',
                        ...browserInfo,
                    },
                    timestamp: Date.now(),
                    hypothesisId: 'D,E,F',
                    runId: 'post-fix',
                }),
            }).catch(() => { });
        }
        // #endregion
    }, [locale, isAdmin, mounted, isMountedUI]);

    // Accurate check for admin routes (including locale prefixes like /ar/admin)
    const isActuallyAdmin = pathname?.match(/\/(ar|fr|en)?\/?admin/);

    // Wait for component to be mounted on client and UI context to be ready
    if (!mounted || !isMountedUI) {
        return (
            <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
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
                <CartSidebar locale={locale} />

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
