'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, Mail } from 'lucide-react';

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
      } else {
        router.push(`/${locale}/shop`);
        router.refresh();
      }
    } catch (error) {
      setError(t('genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('emailLabel')}
        </label>
        <div className="relative">
          <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white ${locale === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white ${locale === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            placeholder="••••••••"
            dir="ltr"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('loggingIn') : t('loginButton')}
      </button>
    </form>
  );
}
