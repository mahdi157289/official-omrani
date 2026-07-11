import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type FamilyKey = 'classic' | 'date' | 'almond' | 'honey';

const productFamilies: Record<FamilyKey, {
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  ingredientsAr: string;
  ingredientsFr: string;
  basePrice: number;
  comparePrice: number;
  stockQuantity: number;
  isNew: boolean;
}> = {
  classic: {
    descriptionAr: 'مقروض تقليدي أصيل مصنوع من أجود المكونات الطبيعية. طعم لا يُقاوم يحمل نكهة التقاليد التونسية الأصيلة.',
    descriptionFr: 'Makroudh traditionnel authentique fait avec les meilleurs ingrédients naturels. Un goût irrésistible qui porte la saveur des traditions tunisiennes authentiques.',
    descriptionEn: 'Authentic traditional makroudh made with the finest natural ingredients. An irresistible taste that carries the flavor of authentic Tunisian traditions.',
    ingredientsAr: 'دقيق أبيض، تمر، زبدة سمن، ماء زهر',
    ingredientsFr: 'Farine blanche, dattes, beurre clarifié, eau de fleur d\'oranger',
    basePrice: 15.5,
    comparePrice: 18.0,
    stockQuantity: 50,
    isNew: false,
  },
  date: {
    descriptionAr: 'مقروض غني بالتمر الطازج، يمنحك طعماً حلواً طبيعياً وملمساً ناعماً.',
    descriptionFr: 'Makroudh riche en dattes fraîches, vous offrant un goût naturellement sucré et une texture douce.',
    descriptionEn: 'Makroudh rich in fresh dates, giving you a naturally sweet taste and soft texture.',
    ingredientsAr: 'دقيق أبيض، تمر طازج، زبدة سمن، ماء زهر',
    ingredientsFr: 'Farine blanche, dattes fraîches, beurre clarifié, eau de fleur d\'oranger',
    basePrice: 18.0,
    comparePrice: 22.0,
    stockQuantity: 40,
    isNew: false,
  },
  almond: {
    descriptionAr: 'مقروض فاخر محشو باللوز المقرمش، يجمع بين الحلاوة والطعم المميز للوز.',
    descriptionFr: 'Makroudh de luxe fourré d\'amandes croquantes, alliant douceur et saveur distinctive des amandes.',
    descriptionEn: 'Luxury makroudh stuffed with crunchy almonds, combining sweetness and the distinctive taste of almonds.',
    ingredientsAr: 'دقيق أبيض، تمر، لوز، زبدة سمن، ماء زهر',
    ingredientsFr: 'Farine blanche, dattes, amandes, beurre clarifié, eau de fleur d\'oranger',
    basePrice: 20.0,
    comparePrice: 25.0,
    stockQuantity: 35,
    isNew: false,
  },
  honey: {
    descriptionAr: 'مقروض مميز محلى بالعسل الطبيعي، يمنحك طعماً فريداً ومغذياً.',
    descriptionFr: 'Makroudh spécial sucré au miel naturel, vous offrant un goût unique et nutritif.',
    descriptionEn: 'Special makroudh sweetened with natural honey, giving you a unique and nutritious taste.',
    ingredientsAr: 'دقيق أبيض، تمر، عسل طبيعي، زبدة سمن، ماء زهر',
    ingredientsFr: 'Farine blanche, dattes, miel naturel, beurre clarifié, eau de fleur d\'oranger',
    basePrice: 22.0,
    comparePrice: 27.0,
    stockQuantity: 30,
    isNew: true,
  },
};

const productCatalog: Array<{
  family: FamilyKey;
  file: string;
  sku: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
}> = [
  { family: 'classic', file: 'product images/00/1.JPG', sku: 'MK-CLASSIC-001', slug: 'makroudh-classic-1', nameAr: 'مقروض كلاسيكي', nameFr: 'Makroudh Classique', nameEn: 'Classic Makroudh' },
  { family: 'classic', file: 'product images/00/2.JPG', sku: 'MK-CLASSIC-002', slug: 'makroudh-classic-2', nameAr: 'مقروض كلاسيكي ٢', nameFr: 'Makroudh Classique II', nameEn: 'Classic Makroudh II' },
  { family: 'classic', file: 'product images/00/9.JPG', sku: 'MK-CLASSIC-003', slug: 'makroudh-classic-3', nameAr: 'مقروض كلاسيكي ٣', nameFr: 'Makroudh Classique III', nameEn: 'Classic Makroudh III' },
  { family: 'date', file: 'product images/00/3.JPG', sku: 'MK-DATE-001', slug: 'makroudh-date-1', nameAr: 'مقروض بالتمر', nameFr: 'Makroudh aux Dattes', nameEn: 'Date Makroudh' },
  { family: 'date', file: 'product images/00/4.JPG', sku: 'MK-DATE-002', slug: 'makroudh-date-2', nameAr: 'مقروض بالتمر ٢', nameFr: 'Makroudh aux Dattes II', nameEn: 'Date Makroudh II' },
  { family: 'date', file: 'product images/00/10.JPG', sku: 'MK-DATE-003', slug: 'makroudh-date-3', nameAr: 'مقروض بالتمر ٣', nameFr: 'Makroudh aux Dattes III', nameEn: 'Date Makroudh III' },
  { family: 'almond', file: 'product images/00/5.JPG', sku: 'MK-ALMOND-001', slug: 'makroudh-almond-1', nameAr: 'مقروض باللوز', nameFr: 'Makroudh aux Amandes', nameEn: 'Almond Makroudh' },
  { family: 'almond', file: 'product images/00/6.JPG', sku: 'MK-ALMOND-002', slug: 'makroudh-almond-2', nameAr: 'مقروض باللوز ٢', nameFr: 'Makroudh aux Amandes II', nameEn: 'Almond Makroudh II' },
  { family: 'almond', file: 'product images/00/11.JPG', sku: 'MK-ALMOND-003', slug: 'makroudh-almond-3', nameAr: 'مقروض باللوز ٣', nameFr: 'Makroudh aux Amandes III', nameEn: 'Almond Makroudh III' },
  { family: 'honey', file: 'product images/00/7.JPG', sku: 'MK-HONEY-001', slug: 'makroudh-honey-1', nameAr: 'مقروض بالعسل', nameFr: 'Makroudh au Miel', nameEn: 'Honey Makroudh' },
  { family: 'honey', file: 'product images/00/8.JPG', sku: 'MK-HONEY-002', slug: 'makroudh-honey-2', nameAr: 'مقروض بالعسل ٢', nameFr: 'Makroudh au Miel II', nameEn: 'Honey Makroudh II' },
  { family: 'honey', file: 'product images/00/12.JPG', sku: 'MK-HONEY-003', slug: 'makroudh-honey-3', nameAr: 'مقروض بالعسل ٣', nameFr: 'Makroudh au Miel III', nameEn: 'Honey Makroudh III' },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@makroudhomrani.tn' },
    update: {},
    create: {
      email: 'admin@makroudhomrani.tn',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created:', admin.email, '(password: admin123)');

  // Create Categories
  console.log('📁 Creating categories...');
  const categoryMakroudh = await prisma.category.upsert({
    where: { slug: 'makroudh' },
    update: {},
    create: {
      nameAr: 'مقروض',
      nameFr: 'Makroudh',
      nameEn: 'Makroudh',
      slug: 'makroudh',
      descriptionAr: 'مقروض تونسي أصيل مصنوع بالطريقة التقليدية',
      descriptionFr: 'Makroudh tunisien authentique fait à la manière traditionnelle',
      descriptionEn: 'Authentic Tunisian makroudh made the traditional way',
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
    },
  });

  // Create Products (12 products, one image each)
  console.log('🍪 Creating products...');

  const retiredSlugs = ['makroudh-classic', 'makroudh-date', 'makroudh-almond', 'makroudh-honey'];
  const deleted = await prisma.product.deleteMany({ where: { slug: { in: retiredSlugs } } });
  if (deleted.count > 0) {
    console.log(`🗑️ Removed ${deleted.count} legacy product(s)`);
  }

  for (const item of productCatalog) {
    const family = productFamilies[item.family];
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        status: 'ACTIVE',
        isFeatured: true,
        basePrice: family.basePrice,
        comparePrice: family.comparePrice,
        stockQuantity: family.stockQuantity,
      },
      create: {
        sku: item.sku,
        slug: item.slug,
        nameAr: item.nameAr,
        nameFr: item.nameFr,
        nameEn: item.nameEn,
        descriptionAr: family.descriptionAr,
        descriptionFr: family.descriptionFr,
        descriptionEn: family.descriptionEn,
        basePrice: family.basePrice,
        comparePrice: family.comparePrice,
        stockQuantity: family.stockQuantity,
        status: 'ACTIVE',
        isFeatured: true,
        isNew: family.isNew,
        categoryId: categoryMakroudh.id,
        ingredientsAr: family.ingredientsAr,
        ingredientsFr: family.ingredientsFr,
        shelfLifeDays: 30,
        storageInstructionsAr: 'يحفظ في مكان بارد وجاف',
        storageInstructionsFr: 'Conserver dans un endroit frais et sec',
      },
    });

    const mediaUrl = `/media/${item.file}`;
    await prisma.media.upsert({
      where: { cloudinaryId: item.sku },
      update: {
        url: mediaUrl,
        secureUrl: mediaUrl,
        fileName: item.file,
        productId: product.id,
        altTextAr: item.nameAr,
        altTextFr: item.nameFr,
        altTextEn: item.nameEn,
      },
      create: {
        fileName: item.file,
        cloudinaryId: item.sku,
        url: mediaUrl,
        secureUrl: mediaUrl,
        altTextAr: item.nameAr,
        altTextFr: item.nameFr,
        altTextEn: item.nameEn,
        type: 'IMAGE',
        productId: product.id,
      },
    });

    const variants = [
      {
        nameAr: '500 جرام',
        nameFr: '500g',
        sku: `${item.sku}-500g`,
        weight: '500',
        priceModifier: 0,
        stockQuantity: family.stockQuantity,
      },
      {
        nameAr: '1 كيلو',
        nameFr: '1kg',
        sku: `${item.sku}-1kg`,
        weight: '1000',
        priceModifier: 0,
        stockQuantity: Math.floor(family.stockQuantity * 0.7),
      },
    ];

    for (const variantData of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variantData.sku },
        update: {},
        create: {
          ...variantData,
          productId: product.id,
        },
      });
    }

    console.log(`✅ Created product: ${item.nameFr}`);
  }

  // Create Site Configuration
  console.log('⚙️ Creating site configuration...');
  await prisma.siteConfig.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      group: 'general',
      value: JSON.stringify({
        ar: 'مقروض العمراني',
        fr: 'Makroudh Omrani',
        en: 'Makroudh Omrani',
      }),
      valueType: 'string',
      labelAr: 'اسم الموقع',
      labelFr: 'Nom du site',
      isPublic: true,
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      group: 'general',
      value: JSON.stringify({
        ar: 'طعم التقليد الأصيل',
        fr: 'Le goût de la tradition authentique',
        en: 'Taste of authentic tradition',
      }),
      valueType: 'string',
      labelAr: 'وصف الموقع',
      labelFr: 'Description du site',
      isPublic: true,
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'contact_phone' },
    update: {},
    create: {
      key: 'contact_phone',
      group: 'contact',
      value: '+216 12 345 678',
      valueType: 'string',
      labelAr: 'رقم الهاتف',
      labelFr: 'Téléphone',
      isPublic: true,
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'contact_email' },
    update: {},
    create: {
      key: 'contact_email',
      group: 'contact',
      value: 'info@makroudhomrani.tn',
      valueType: 'string',
      labelAr: 'البريد الإلكتروني',
      labelFr: 'Email',
      isPublic: true,
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'contact_address' },
    update: {},
    create: {
      key: 'contact_address',
      group: 'contact',
      value: JSON.stringify({
        ar: 'القيروان، تونس',
        fr: 'Kairouan, Tunisia',
        en: 'Kairouan, Tunisia',
      }),
      valueType: 'string',
      labelAr: 'العنوان',
      labelFr: 'Adresse',
      isPublic: true,
    },
  });

  // Create Packages
  console.log('📦 Creating packages...');
  
  // Create package image
  const packageImage = await prisma.media.upsert({
    where: { cloudinaryId: 'package-family-001' },
    update: {},
    create: {
      fileName: 'media3.jpg',
      cloudinaryId: 'package-family-001',
      url: '/media/media3.jpg',
      secureUrl: '/media/media3.jpg',
      altTextAr: 'باقة العائلة',
      altTextFr: 'Pack Famille',
      altTextEn: 'Family Pack',
      type: 'IMAGE',
    }
  });

  const package1 = await prisma.package.upsert({
    where: { slug: 'family-pack' },
    update: {},
    create: {
      nameAr: 'باقة العائلة',
      nameFr: 'Pack Famille',
      nameEn: 'Family Pack',
      slug: 'family-pack',
      descriptionAr: 'تشكيلة متنوعة من أشهى أنواع المقروض تكفي لجميع أفراد العائلة (3 كغ)',
      descriptionFr: 'Une sélection variée de nos meilleurs makroudhs pour toute la famille (3kg)',
      descriptionEn: 'A varied selection of our finest makroudh for the whole family (3kg)',
      price: 45.000,
      discountPrice: 39.900,
      imageId: packageImage.id,
      isFeatured: true,
      isActive: true,
      displayOrder: 1,
    }
  });

  // Create package image 2
  const packageImage2 = await prisma.media.upsert({
    where: { cloudinaryId: 'package-gift-001' },
    update: {},
    create: {
      fileName: 'media5.jpg',
      cloudinaryId: 'package-gift-001',
      url: '/media/media5.jpg',
      secureUrl: '/media/media5.jpg',
      altTextAr: 'باقة الهدايا',
      altTextFr: 'Coffret Cadeau',
      altTextEn: 'Gift Box',
      type: 'IMAGE',
    }
  });

  const package2 = await prisma.package.upsert({
    where: { slug: 'gift-box' },
    update: {},
    create: {
      nameAr: 'باقة الهدايا الفاخرة',
      nameFr: 'Coffret Cadeau de Luxe',
      nameEn: 'Luxury Gift Box',
      slug: 'gift-box',
      descriptionAr: 'علبة فاخرة تحتوي على تشكيلة مميزة من المقروض باللوز والفستق، مثالية للإهداء',
      descriptionFr: 'Un coffret luxueux contenant une sélection spéciale de makroudh aux amandes et pistaches, parfait pour offrir',
      descriptionEn: 'A luxurious box containing a special selection of almond and pistachio makroudh, perfect for gifting',
      price: 65.000,
      discountPrice: null,
      imageId: packageImage2.id,
      isFeatured: true,
      isActive: true,
      displayOrder: 2,
    }
  });

  console.log('✅ Packages created');

  // Create Gallery Items
  console.log('🖼️ Creating gallery items...');

  const galleryImages = [
    { file: 'media.jpg', id: 'gallery-001', title: 'تحضير العجين', titleFr: 'Préparation de la pâte' },
    { file: 'media2.jpg', id: 'gallery-002', title: 'نقش المقروض', titleFr: 'Décoration du Makroudh' },
    { file: 'media4.jpg', id: 'gallery-003', title: 'التعسيل', titleFr: 'Trempage dans le miel' },
    { file: 'media6.jpg', id: 'gallery-004', title: 'التقديم النهائي', titleFr: 'Présentation finale' },
  ];

  for (let i = 0; i < galleryImages.length; i++) {
    const img = galleryImages[i];
    
    // Create media first
    const media = await prisma.media.upsert({
      where: { cloudinaryId: img.id },
      update: {},
      create: {
        fileName: img.file,
        cloudinaryId: img.id,
        url: `/media/${img.file}`,
        secureUrl: `/media/${img.file}`,
        altTextAr: img.title,
        altTextFr: img.titleFr,
        type: 'IMAGE',
      }
    });

    // Create gallery item
    await prisma.galleryItem.upsert({
      where: { mediaId: media.id },
      update: {},
      create: {
        titleAr: img.title,
        titleFr: img.titleFr,
        descriptionAr: 'لمحة من ورشتنا التقليدية',
        descriptionFr: 'Un aperçu de notre atelier traditionnel',
        mediaId: media.id,
        displayOrder: i + 1,
        isActive: true,
      }
    });
  }

  console.log('✅ Gallery items created');

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

