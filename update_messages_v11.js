const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const newPackageKeys = {
    en: {
        packageContents: "Pack Contents",
        packageContentsDesc: "List the types of goods / products included in this pack",
        packageContentsAr: "Pack Contents (Arabic)",
        packageContentsFr: "Pack Contents (French)",
        packageContentsEn: "Pack Contents (English)",
        pricingDetails: "Pricing & Details",
        priceTnd: "Price (TND)",
        discountPriceTnd: "Discount Price (TND)",
        displayOrder: "Display Order",
        featuredPackage: "Featured Package (Olive Oil)",
        featuredPackageDesc: "Show this package on the homepage slider",
        packageImage: "Package Image",
        updatePackage: "Update Package",
        createPackage: "Create Package"
    },
    fr: {
        packageContents: "Contenu du pack",
        packageContentsDesc: "Listez les types de produits inclus dans ce pack",
        packageContentsAr: "Contenu du pack (Arabe)",
        packageContentsFr: "Contenu du pack (Français)",
        packageContentsEn: "Contenu du pack (Anglais)",
        pricingDetails: "Prix et détails",
        priceTnd: "Prix (TND)",
        discountPriceTnd: "Prix après remise (TND)",
        displayOrder: "Ordre d'affichage",
        featuredPackage: "Pack en vedette (Huile d'olive)",
        featuredPackageDesc: "Afficher ce pack dans le curseur de la page d'accueil",
        packageImage: "Image du pack",
        updatePackage: "Modifier le pack",
        createPackage: "Créer le pack"
    },
    ar: {
        packageContents: "محتويات الحزمة",
        packageContentsDesc: "قائمة بمنتجات هذه الحزمة",
        packageContentsAr: "محتويات الحزمة (بالعربية)",
        packageContentsFr: "محتويات الحزمة (بالفرنسية)",
        packageContentsEn: "محتويات الحزمة (بالانجليزية)",
        pricingDetails: "التسعير والتفاصيل",
        priceTnd: "السعر (د.ت)",
        discountPriceTnd: "السعر بعد التخفيض (د.ت)",
        displayOrder: "ترتيب العرض",
        featuredPackage: "حزمة مميزة (زيت زيتون)",
        featuredPackageDesc: "عرض هذه الحزمة في الصفحة الرئيسية",
        packageImage: "صورة الحزمة",
        updatePackage: "تحديث الحزمة",
        createPackage: "إنشاء حزمة"
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.admin = {
        ...data.admin,
        ...newPackageKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with package keys`);
});
