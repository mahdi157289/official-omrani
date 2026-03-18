const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const newProductFormKeys = {
    en: {
        basicInfo: "Basic Information",
        nameAr: "Name (Arabic)",
        nameFr: "Name (French)",
        nameEn: "Name (English - Optional)",
        selectCategory: "Select Category",
        priceUnit: "Price (TND)",
        stockQuantity: "Stock Quantity",
        visibility: "Visibility on Site",
        showOnSite: "Yes, Show on Site",
        hideFromSite: "No, Hide from Site",
        featuredProduct: "Featured Product (Olive Oil)",
        featuredDescription: "Show this product on the homepage slider",
        newArrival: "New Arrival",
        newArrivalDescription: "Add a 'New' badge to this product",
        descriptionAr: "Description (Arabic)",
        descriptionFr: "Description (French)",
        descriptionEn: "Description (English)",
        ingredients: "Ingredients",
        ingredientsAr: "Ingredients (Arabic)",
        ingredientsFr: "Ingredients (French)",
        ingredientsEn: "Ingredients (English)",
        updateProduct: "Update Product",
        createProduct: "Create Product"
    },
    fr: {
        basicInfo: "Informations de base",
        nameAr: "Nom (Arabe)",
        nameFr: "Nom (Français)",
        nameEn: "Nom (Anglais - Optionnel)",
        selectCategory: "Sélect. Catégorie",
        priceUnit: "Prix (TND)",
        stockQuantity: "Quantité en stock",
        visibility: "Visibilité sur le site",
        showOnSite: "Oui, Afficher sur le site",
        hideFromSite: "Non, Masquer du site",
        featuredProduct: "Produit Vedette (Huile d'olive)",
        featuredDescription: "Afficher sur le carrousel d'accueil",
        newArrival: "Nouvelle Arrivée",
        newArrivalDescription: "Ajouter un badge 'Nouveau'",
        descriptionAr: "Description (Arabe)",
        descriptionFr: "Description (Français)",
        descriptionEn: "Description (Anglais)",
        ingredients: "Ingrédients",
        ingredientsAr: "Ingrédients (Arabe)",
        ingredientsFr: "Ingrédients (Français)",
        ingredientsEn: "Ingrédients (Anglais)",
        updateProduct: "Modifier le produit",
        createProduct: "Créer le produit"
    },
    ar: {
        basicInfo: "معلومات أساسية",
        nameAr: "الاسم (بالعربية)",
        nameFr: "الاسم (بالفرنسية)",
        nameEn: "الاسم (بالإنجليزية - اختياري)",
        selectCategory: "اختر التصنيف",
        priceUnit: "السعر (د.ت)",
        stockQuantity: "الكمية في المخزن",
        visibility: "الظهور على الموقع",
        showOnSite: "نعم، يظهر على الموقع",
        hideFromSite: "لا، مخفي من الموقع",
        featuredProduct: "منتج مميز (زيت زيتون)",
        featuredDescription: "عرض المنتج في سلايدر الصفحة الرئيسية",
        newArrival: "وصل حديثاً",
        newArrivalDescription: "أضف علامة 'جديد' لهذا المنتج",
        descriptionAr: "الوصف (بالعربية)",
        descriptionFr: "الوصف (بالفرنسية)",
        descriptionEn: "الوصف (بالإنجليزية)",
        ingredients: "المكونات",
        ingredientsAr: "المكونات (بالعربية)",
        ingredientsFr: "المكونات (بالفرنسية)",
        ingredientsEn: "المكونات (بالإنجليزية)",
        updateProduct: "تعديل المنتج",
        createProduct: "إضافة منتج"
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.admin = {
        ...data.admin,
        ...newProductFormKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with product form keys`);
});
