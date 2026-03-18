import type { Metadata } from 'next';
import { Playfair_Display, Amiri, Lato } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Makroudh Omrani - Taste of Tradition',
  description: 'Authentic Tunisian Makroudh delivered to your door',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} ${amiri.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
