'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';

interface MediaUploadProps {
  onUploadComplete?: (media: any) => void;
}

export function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (onUploadComplete) {
          onUploadComplete(data.media);
        } else {
          window.location.reload();
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <label className={`flex flex-col items-center gap-2 p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${uploading ? 'opacity-50' : ''}`}>
      {uploading ? (
        <CoinLoader className="w-6 h-6 animate-spin text-primary" wrapperClassName="contents" />
      ) : (
        <Upload className="w-6 h-6 text-gray-500" />
      )}
      <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Upload Image'}</span>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
    </label>
  );
}
