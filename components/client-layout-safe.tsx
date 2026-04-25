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
        // Initialization side effects can be added here
    }, [locale, isAdmin, mounted]);

    if (!mounted) {
        return (
            <div 
                lang={locale} 
                dir={locale === 'ar' ? 'rtl' : 'ltr'} 
                className="min-h-screen bg-background"
                style={{ backgroundColor: '#00353F' }}
            >
                {/* Ensure children aren't visible yet to prevent flickering before splash mounts */}
                <div className="opacity-0">{children}</div>
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
