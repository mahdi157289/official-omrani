'use client';

import { useState, useEffect } from 'react';

export function SettingsForm() {
  const [settings, setSettings] = useState<any>({
    exchange_rate_usd: '0.32',
    exchange_rate_eur: '0.30'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map: any = {};
          data.forEach((c: any) => {
            map[c.key] = c.value;
          });
          setSettings((prev: any) => ({ ...prev, ...map }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        const err = await res.json();
        alert('Failed to save settings: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💱</span> Currency Exchange Rates
        </h2>
        
        <p className="text-sm text-gray-500 mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          Define the conversion rates from <strong>Tunisian Dinar (TND)</strong> to other currencies. 
          Stripe will use these rates to charge customers in their local currency.
          <br/>
          <span className="font-mono mt-2 block">Example: If 1 TND = 0.32 USD, enter 0.32 below.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              USD Rate ($) <span className="text-gray-400 font-normal ml-1">1 TND to USD</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input 
                type="number" 
                step="0.0001"
                value={settings.exchange_rate_usd} 
                onChange={(e) => setSettings({...settings, exchange_rate_usd: e.target.value})}
                className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 shadow-sm transition-all"
                placeholder="0.32"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              EUR Rate (€) <span className="text-gray-400 font-normal ml-1">1 TND to EUR</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
              <input 
                type="number" 
                step="0.0001"
                value={settings.exchange_rate_eur} 
                onChange={(e) => setSettings({...settings, exchange_rate_eur: e.target.value})}
                className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 shadow-sm transition-all"
                placeholder="0.30"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
