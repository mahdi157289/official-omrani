/** Convert Prisma Decimal / string / number to a plain number for client components. */
export function toClientNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (
    typeof value === 'object' &&
    value !== null &&
    'toNumber' in value &&
    typeof (value as { toNumber: () => number }).toNumber === 'function'
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

export function serializePackage(pkg: Record<string, unknown>) {
  const image = pkg.image as Record<string, unknown> | null | undefined;

  return {
    id: pkg.id,
    nameAr: pkg.nameAr,
    nameFr: pkg.nameFr,
    nameEn: pkg.nameEn,
    slug: pkg.slug,
    descriptionAr: pkg.descriptionAr,
    descriptionFr: pkg.descriptionFr,
    descriptionEn: pkg.descriptionEn,
    price: toClientNumber(pkg.price),
    discountPrice: pkg.discountPrice != null ? toClientNumber(pkg.discountPrice) : null,
    isFeatured: pkg.isFeatured,
    isActive: pkg.isActive,
    displayOrder: pkg.displayOrder,
    image: image
      ? {
          id: image.id,
          url: image.url,
          secureUrl: image.secureUrl,
          altTextAr: image.altTextAr,
          altTextFr: image.altTextFr,
          altTextEn: image.altTextEn,
        }
      : null,
  };
}

export function serializeProduct(product: Record<string, unknown>) {
  const images = (product.images as Record<string, unknown>[] | undefined) ?? [];
  const category = product.category as Record<string, unknown> | undefined;
  const variants = (product.variants as Record<string, unknown>[] | undefined) ?? [];

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    nameAr: product.nameAr,
    nameFr: product.nameFr,
    nameEn: product.nameEn,
    descriptionAr: product.descriptionAr,
    descriptionFr: product.descriptionFr,
    descriptionEn: product.descriptionEn,
    ingredientsAr: product.ingredientsAr,
    ingredientsFr: product.ingredientsFr,
    ingredientsEn: product.ingredientsEn,
    basePrice: toClientNumber(product.basePrice),
    comparePrice: product.comparePrice != null ? toClientNumber(product.comparePrice) : null,
    stockQuantity: product.stockQuantity,
    status: product.status,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    storeType: 'product' as const,
    images: images.map((img) => ({
      id: img.id,
      url: img.url,
      secureUrl: img.secureUrl,
      altTextAr: img.altTextAr,
      altTextFr: img.altTextFr,
      altTextEn: img.altTextEn,
    })),
    category: category
      ? {
          nameAr: category.nameAr,
          nameFr: category.nameFr,
          nameEn: category.nameEn,
        }
      : { nameAr: '', nameFr: '', nameEn: null },
    variants: variants.map((v) => ({
      id: v.id,
      nameAr: v.nameAr,
      nameFr: v.nameFr,
      sku: v.sku,
      weight: v.weight,
      priceModifier: toClientNumber(v.priceModifier),
      stockQuantity: v.stockQuantity,
      isActive: v.isActive,
    })),
  };
}

export function serializeStoreItem(item: Record<string, unknown>) {
  if (item.storeType === 'package') {
    return { ...serializePackage(item), storeType: 'package' as const };
  }
  return serializeProduct(item);
}
