'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type CoinLoaderProps = {
  className?: string;
  message?: string;
  wrapperClassName?: string;
};

export function CoinLoader({
  className = 'h-6 w-6 animate-spin text-primary',
  message,
  wrapperClassName = 'flex flex-col items-center gap-3',
}: CoinLoaderProps) {
  return (
    <div className={wrapperClassName}>
      <Loader2 className={className} />
      {message ? <p className="text-gray-500 animate-pulse text-sm">{message}</p> : null}
    </div>
  );
}
