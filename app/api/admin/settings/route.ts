import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = await prisma.siteConfig.findMany({
      where: {
        OR: [
          { group: 'currency' },
          { key: { in: ['exchange_rate_usd', 'exchange_rate_eur'] } }
        ]
      }
    });

    return NextResponse.json(configs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await req.json();

    for (const key of Object.keys(settings)) {
      await prisma.siteConfig.upsert({
        where: { key: key },
        update: { value: String(settings[key]) },
        create: {
          key: key,
          value: String(settings[key]),
          group: 'currency',
          valueType: 'number'
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
