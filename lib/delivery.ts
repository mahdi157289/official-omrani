/**
 * Delivery zone configuration
 */
export const DELIVERY_ZONES = {
  ZONE_1: {
    nameAr: 'مدينة القيروان',
    nameFr: 'Kairouan City',
    fee: 3,
    freeDeliveryThreshold: 50,
    sameDayCutoff: 14, // 2 PM
    estimatedDays: 1,
  },
  ZONE_2: {
    nameAr: 'القيروان الكبرى',
    nameFr: 'Greater Kairouan',
    fee: 5,
    freeDeliveryThreshold: 50,
    estimatedDays: 1,
  },
  ZONE_3: {
    nameAr: 'مدينة تونس',
    nameFr: 'Tunis City',
    fee: 7,
    freeDeliveryThreshold: 80,
    estimatedDays: 2,
  },
  ZONE_4: {
    nameAr: 'مدن أخرى',
    nameFr: 'Other Cities',
    fee: 10,
    freeDeliveryThreshold: 80,
    estimatedDays: 3,
  },
} as const;

/**
 * Calculate delivery fee based on zone and order amount
 */
export function calculateDeliveryFee(
  zone: keyof typeof DELIVERY_ZONES,
  orderAmount: number
): number {
  const zoneConfig = DELIVERY_ZONES[zone];
  
  if (orderAmount >= zoneConfig.freeDeliveryThreshold) {
    return 0;
  }
  
  return zoneConfig.fee;
}

/**
 * Get delivery time slots
 */
export function getDeliveryTimeSlots(): string[] {
  return [
    '9:00-12:00',
    '12:00-15:00',
    '15:00-18:00',
    '18:00-21:00',
  ];
}







