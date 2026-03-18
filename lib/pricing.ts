import { Decimal } from '@prisma/client/runtime/library';

/**
 * Calculate display price based on base price and selected weight
 * Formula: Display Price = Base Price × (Selected Weight in grams / 100)
 */
export function calculatePrice(
  basePrice: number | Decimal | string,
  weightInGrams: number
): number {
  const base = typeof basePrice === 'object' 
    ? basePrice.toNumber() 
    : typeof basePrice === 'string'
    ? parseFloat(basePrice)
    : basePrice;
  return (base * weightInGrams) / 100;
}

/**
 * Calculate discount percentage
 * Formula: Discount % = ((Compare Price - Display Price) / Compare Price) × 100
 */
export function calculateDiscount(
  comparePrice: number | Decimal,
  displayPrice: number | Decimal
): number {
  const compare = typeof comparePrice === 'object' ? comparePrice.toNumber() : comparePrice;
  const display = typeof displayPrice === 'object' ? displayPrice.toNumber() : displayPrice;
  
  if (compare <= display) return 0;
  return ((compare - display) / compare) * 100;
}

/**
 * Format price as TND with 3 decimal places
 */
export function formatPrice(price: number | Decimal): string {
  const numPrice = typeof price === 'object' ? price.toNumber() : price;
  return `${numPrice.toFixed(3)} TND`;
}

