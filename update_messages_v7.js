const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const newAdminKeys = {
    en: {
        active: "Active",
        draft: "Draft",
        currency: "DT"
    },
    fr: {
        active: "Actif",
        draft: "Brouillon",
        currency: "DT"
    },
    ar: {
        active: "نشط",
        draft: "مسودة",
        currency: "د.ت"
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Add new admin keys
    data.admin = {
        ...data.admin,
        ...newAdminKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json`);
});
