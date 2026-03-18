'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';

interface DeleteButtonProps {
  apiEndpoint: string;
  itemId: string;
  onDelete?: () => void;
}

export function DeleteButton({ apiEndpoint, itemId, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50"
    >
      {loading ? <CoinLoader className="w-5 h-5 animate-spin" wrapperClassName="contents" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
