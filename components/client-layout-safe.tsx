'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from './client-layout';
import { BrowserErrorHandler } from './browser-error-handler';

export function ClientLayoutSafe({
    children,
    locale,
    isAdmin
}: {
    children: React.ReactNode;
    locale: string;
    isAdmin: boolean;
}) {
    // Ensure component only renders on client to avoid React 19 initialization issues
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        // #region agent log (avoid render-time side effects)
        if (typeof window !== 'undefined' && typeof fetch === 'function') {
            const browserInfo = typeof navigator !== 'undefined' ? {
                isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
                isEdge: /Edg/.test(navigator.userAgent),
                userAgent: navigator.userAgent.substring(0, 100),
            } : {};
            fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: 'client-layout-safe.tsx:useEffect',
                    message: 'ClientLayoutSafe mounted',
                    data: { locale, isAdmin, mounted, hasWindow: typeof window !== 'undefined', ...browserInfo },
                    timestamp: Date.now(),
                    hypothesisId: 'C,F',
                    runId: 'post-fix',
                }),
            }).catch(() => { });
        }
        // #endregion
    }, [locale, isAdmin, mounted]);

    if (!mounted) {
        return (
            <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
                {children}
            </div>
        );
    }

    // Simple wrapper that ensures ClientLayout is rendered as a client component
    return (
        <>
            <BrowserErrorHandler />
            <ClientLayout locale={locale} isAdmin={isAdmin}>
                {children}
            </ClientLayout>
        </>
    );
}

// Default export for dynamic imports
export default ClientLayoutSafe;
