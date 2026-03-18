import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/auth-helpers';
import { AdminTools } from '@/components/admin/admin-tools';
import { AdminContentWrapper } from '@/components/admin/admin-content-wrapper';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const xPathname = headersList.get('x-pathname') || '';

  // Clean pathname (remove query params if any)
  const pathname = xPathname.split('?')[0];

  // Matches /admin/login OR /fr/admin/login etc.
  const isLoginPage = /\/admin\/login\/?$/.test(pathname);

  // Skip authentication for login page
  if (!isLoginPage) {
    await requireAdmin();
  }

  // Login page doesn't need sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <AdminSidebar />
        <AdminContentWrapper>
          <main className="p-8">
            {children}
          </main>
        </AdminContentWrapper>
      </div>
      <AdminTools />
    </div>
  );
}
