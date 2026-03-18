'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, Mail, User, Phone } from 'lucide-react';

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('genericError'));
      }

      // Redirect to login on success
      router.push(`/${locale}/login?registered=true`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('firstName')}
          </label>
          <div className="relative">
            <User className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('lastName')}
          </label>
          <div className="relative">
            <User className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('emailLabel')}
        </label>
        <div className="relative">
          <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          {t('phone')}
        </label>
        <div className="relative">
          <Phone className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 ${locale === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
            dir="ltr"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {loading ? t('registering') : t('registerButton')}
      </button>
    </form>
  );
}
