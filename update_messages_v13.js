const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const translations = {
    en: "Loading...",
    fr: "Chargement en cours...",
    ar: "جاري التحميل..."
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (content.admin) {
        content.admin.loading = translations[locale];
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with loading key`);
});
