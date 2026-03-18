import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Map of media files to products
const mediaMapping = [
  { file: 'media.jpg', productIndex: 0 },
  { file: 'media2.jpg', productIndex: 0 },
  { file: 'media3.jpg', productIndex: 1 },
  { file: 'media4.jpg', productIndex: 1 },
  { file: 'media5.jpg', productIndex: 2 },
  { file: 'media6.jpg', productIndex: 2 },
  { file: 'media7.jpg', productIndex: 3 },
  { file: 'media8.jpg', productIndex: 3 },
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

  // Create Products
  console.log('🍪 Creating products...');

  const products = [
    {
      sku: 'MK-CLASSIC-001',
      slug: 'makroudh-classic',
      nameAr: 'مقروض كلاسيكي',
      nameFr: 'Makroudh Classique',
      nameEn: 'Classic Makroudh',
      descriptionAr: 'مقروض تقليدي أصيل مصنوع من أجود المكونات الطبيعية. طعم لا يُقاوم يحمل نكهة التقاليد التونسية الأصيلة.',
      descriptionFr: 'Makroudh traditionnel authentique fait avec les meilleurs ingrédients naturels. Un goût irrésistible qui porte la saveur des traditions tunisiennes authentiques.',
      descriptionEn: 'Authentic traditional makroudh made with the finest natural ingredients. An irresistible taste that carries the flavor of authentic Tunisian traditions.',
      basePrice: 15.5,
      comparePrice: 18.0,
      stockQuantity: 50,
      status: 'ACTIVE',
      isFeatured: true,
      isNew: false,
      categoryId: categoryMakroudh.id,
      ingredientsAr: 'دقيق أبيض، تمر، زبدة سمن، ماء زهر',
      ingredientsFr: 'Farine blanche, dattes, beurre clarifié, eau de fleur d\'oranger',
      shelfLifeDays: 30,
      storageInstructionsAr: 'يحفظ في مكان بارد وجاف',
      storageInstructionsFr: 'Conserver dans un endroit frais et sec',
    },
    {
      sku: 'MK-DATE-001',
      slug: 'makroudh-date',
      nameAr: 'مقروض بالتمر',
      nameFr: 'Makroudh aux Dattes',
      nameEn: 'Date Makroudh',
      descriptionAr: 'مقروض غني بالتمر الطازج، يمنحك طعماً حلواً طبيعياً وملمساً ناعماً.',
      descriptionFr: 'Makroudh riche en dattes fraîches, vous offrant un goût naturellement sucré et une texture douce.',
      descriptionEn: 'Makroudh rich in fresh dates, giving you a naturally sweet taste and soft texture.',
      basePrice: 18.0,
      comparePrice: 22.0,
      stockQuantity: 40,
      status: 'ACTIVE',
      isFeatured: true,
      isNew: false,
      categoryId: categoryMakroudh.id,
      ingredientsAr: 'دقيق أبيض، تمر طازج، زبدة سمن، ماء زهر',
      ingredientsFr: 'Farine blanche, dattes fraîches, beurre clarifié, eau de fleur d\'oranger',
      shelfLifeDays: 30,
      storageInstructionsAr: 'يحفظ في مكان بارد وجاف',
      storageInstructionsFr: 'Conserver dans un endroit frais et sec',
    },
    {
      sku: 'MK-ALMOND-001',
      slug: 'makroudh-almond',
      nameAr: 'مقروض باللوز',
      nameFr: 'Makroudh aux Amandes',
      nameEn: 'Almond Makroudh',
      descriptionAr: 'مقروض فاخر محشو باللوز المقرمش، يجمع بين الحلاوة والطعم المميز للوز.',
      descriptionFr: 'Makroudh de luxe fourré d\'amandes croquantes, alliant douceur et saveur distinctive des amandes.',
      descriptionEn: 'Luxury makroudh stuffed with crunchy almonds, combining sweetness and the distinctive taste of almonds.',
      basePrice: 20.0,
      comparePrice: 25.0,
      stockQuantity: 35,
      status: 'ACTIVE',
      isFeatured: true,
      isNew: false,
      categoryId: categoryMakroudh.id,
      ingredientsAr: 'دقيق أبيض، تمر، لوز، زبدة سمن، ماء زهر',
      ingredientsFr: 'Farine blanche, dattes, amandes, beurre clarifié, eau de fleur d\'oranger',
      shelfLifeDays: 30,
      storageInstructionsAr: 'يحفظ في مكان بارد وجاف',
      storageInstructionsFr: 'Conserver dans un endroit frais et sec',
    },
    {
      sku: 'MK-HONEY-001',
      slug: 'makroudh-honey',
      nameAr: 'مقروض بالعسل',
      nameFr: 'Makroudh au Miel',
      nameEn: 'Honey Makroudh',
      descriptionAr: 'مقروض مميز محلى بالعسل الطبيعي، يمنحك طعماً فريداً ومغذياً.',
      descriptionFr: 'Makroudh spécial sucré au miel naturel, vous offrant un goût unique et nutritif.',
      descriptionEn: 'Special makroudh sweetened with natural honey, giving you a unique and nutritious taste.',
      basePrice: 22.0,
      comparePrice: 27.0,
      stockQuantity: 30,
      status: 'ACTIVE',
      isFeatured: true,
      isNew: true,
      categoryId: categoryMakroudh.id,
      ingredientsAr: 'دقيق أبيض، تمر، عسل طبيعي، زبدة سمن، ماء زهر',
      ingredientsFr: 'Farine blanche, dattes, miel naturel, beurre clarifié, eau de fleur d\'oranger',
      shelfLifeDays: 30,
      storageInstructionsAr: 'يحفظ في مكان بارد وجاف',
      storageInstructionsFr: 'Conserver dans un endroit frais et sec',
    },
  ];

  for (let productIndex = 0; productIndex < products.length; productIndex++) {
    const productData = products[productIndex];
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });

    // Create product images using local media files
    const productMediaFiles = mediaMapping.filter(m => m.productIndex === productIndex);
    const defaultMediaFiles = productIndex === 0 
      ? ['media.jpg', 'media2.jpg']
      : productIndex === 1
      ? ['media3.jpg', 'media4.jpg']
      : productIndex === 2
      ? ['media5.jpg', 'media6.jpg']
      : ['media7.jpg', 'media8.jpg'];
    
    const imageFiles = productMediaFiles.length > 0 
      ? productMediaFiles.map(m => m.file)
      : defaultMediaFiles;

    for (let index = 0; index < imageFiles.length && index < 2; index++) {
      const mediaFile = imageFiles[index];
      const mediaUrl = `/media/${mediaFile}`;
      
      await prisma.media.upsert({
        where: {
          cloudinaryId: `${product.slug}-${index}`,
        },
        update: {},
        create: {
          fileName: mediaFile,
          cloudinaryId: `${product.slug}-${index}`,
          url: mediaUrl,
          secureUrl: mediaUrl,
          altTextAr: index === 0 ? productData.nameAr : `${productData.nameAr} - صورة إضافية`,
          altTextFr: index === 0 ? productData.nameFr : `${productData.nameFr} - Image supplémentaire`,
          altTextEn: index === 0 ? productData.nameEn : `${productData.nameEn} - Additional image`,
          type: 'IMAGE',
          productId: product.id,
        },
      });
    }

    // Create product variants (weight options)
    const variants = [
      {
        nameAr: '500 جرام',
        nameFr: '500g',
        sku: `${product.sku}-500g`,
        weight: '500',
        priceModifier: 0,
        stockQuantity: productData.stockQuantity,
      },
      {
        nameAr: '1 كيلو',
        nameFr: '1kg',
        sku: `${product.sku}-1kg`,
        weight: '1000',
        priceModifier: 0,
        stockQuantity: Math.floor(productData.stockQuantity * 0.7),
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

    console.log(`✅ Created product: ${productData.nameFr}`);
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

