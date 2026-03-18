import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | { toNumber?: () => number }): string {
  let numPrice: number;
  
  if (typeof price === 'string') {
    numPrice = parseFloat(price);
  } else if (typeof price === 'object' && price !== null && 'toNumber' in price && typeof price.toNumber === 'function') {
    // Prisma Decimal
    numPrice = price.toNumber();
  } else {
    numPrice = Number(price) || 0;
  }
  
  return `${numPrice.toFixed(3)} TND`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  return `MO-${year}${month}${day}-${random}`;
}
