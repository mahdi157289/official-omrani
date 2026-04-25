import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: {
        isPublic: true,
        key: { in: ['exchange_rate_usd', 'exchange_rate_eur'] }
      }
    });

    const rates = {
      usd: 0.32,
      eur: 0.30
    };

    configs.forEach(c => {
      if (c.key === 'exchange_rate_usd') rates.usd = parseFloat(c.value || '0.32');
      if (c.key === 'exchange_rate_eur') rates.eur = parseFloat(c.value || '0.30');
    });

    return NextResponse.json(rates);
  } catch (error: any) {
    return NextResponse.json({ usd: 0.32, eur: 0.30 }); // Fallback
  }
}
