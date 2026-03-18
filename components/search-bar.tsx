'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useLocale } from 'next-intl';

export function SearchBar() {
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            locale === 'ar'
              ? 'ابحث عن منتج...'
              : locale === 'fr'
                ? 'Rechercher un produit...'
                : 'Search for a product...'
          }
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black bg-white"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </form>
  );
}





