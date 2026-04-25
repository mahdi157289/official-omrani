'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { CartProvider } from '@/components/providers/cart-provider';

import { Logo3D as CoinLoader } from './logo-3d';

// Dynamically import ClientLayoutSafe with SSR disabled to prevent Chrome hydration issues
// This must be in a client component to use ssr: false
const ClientLayoutSafe = dynamic(
  () => import('@/components/client-layout-safe'),
  { 
    ssr: false, // Completely disable SSR for this component to prevent Chrome hydration errors
    loading: () => (
      <div 
        className="min-h-screen bg-[#00353F]" 
        style={{ backgroundColor: '#00353F' }}
      />
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
    <ClientLayoutSafe locale={locale} isAdmin={isAdmin}>
      {children}
    </ClientLayoutSafe>
  );
}
