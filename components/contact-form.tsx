'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Send email via API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-semibold">
          {t('success')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('name')} *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('email')} *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('phone')}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('subject')} *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('message')} *
        </label>
        <textarea
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('sending') : t('send')}
      </button>
    </form>
  );
}
