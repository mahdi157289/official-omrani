const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const newCategoryKeys = {
    en: {
        categoryPhoto: "Category Photo",
        updateCategory: "Update Category",
        saveCategory: "Save Category"
    },
    fr: {
        categoryPhoto: "Photo de la catégorie",
        updateCategory: "Modifier la catégorie",
        saveCategory: "Enregistrer la catégorie"
    },
    ar: {
        categoryPhoto: "صورة التصنيف",
        updateCategory: "تعديل التصنيف",
        saveCategory: "حفظ التصنيف"
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.admin = {
        ...data.admin,
        ...newCategoryKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with category keys`);
});
