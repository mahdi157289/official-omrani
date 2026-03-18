import { auth } from './auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale } from '@/i18n';

export async function getAdminSession() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const role = session.user.role;
  if (role !== 'ADMIN' && role !== 'EDITOR') {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    // Get locale from pathname
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const locale = pathname.split('/')[1] || defaultLocale;
    redirect(`/${locale}/admin/login`);
  }

  return session;
}

export async function isAdmin() {
  const session = await getAdminSession();
  return !!session;
}
