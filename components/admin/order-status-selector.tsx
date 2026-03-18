'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoinLoader } from '@/components/ui/coin-loader';

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
        className={`
          block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border
          ${status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
          ${status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
          ${status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
        `}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && <CoinLoader className="w-4 h-4 animate-spin text-gray-500" wrapperClassName="contents" />}
    </div>
  );
}
