'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { CartProvider } from '@/components/providers/cart-provider';

// Import the 3D coin loader safely (client-only) so it can never break startup.
const CoinLoader = dynamic(
  () => import('./logo-3d').then((m) => m.Logo3D),
  {
    ssr: false,
    loading: () => (
      <img
        src="/media/logo.png"
        alt="Logo"
        className="h-full w-full object-contain"
        draggable={false}
      />
    ),
  }
);

// Dynamically import ClientLayoutSafe with SSR disabled to prevent Chrome hydration issues
// This must be in a client component to use ssr: false
const ClientLayoutSafe = dynamic(
  () => import('@/components/client-layout-safe'),
  { 
    ssr: false, // Completely disable SSR for this component to prevent Chrome hydration errors
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 3
          }}
          className="w-64 h-64 md:w-[320px] md:h-[320px] flex items-center justify-center"
        >
          {/* 3D coin loader (falls back to 2D logo if WebGL is unavailable) */}
          <CoinLoader isRotating={true} />
        </motion.div>
      </div>
    )
  }
);

export function ClientLayoutWrapper({
  children,
  locale,
  isAdmin
}: {
  children: React.ReactNode;
  locale: string;
  isAdmin: boolean;
}) {
  return (
    <CartProvider locale={locale}>
      <ClientLayoutSafe locale={locale} isAdmin={isAdmin}>
        {children}
      </ClientLayoutSafe>
    </CartProvider>
  );
}
