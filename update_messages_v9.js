const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const newStatusKeys = {
    en: {
        pending: "Pending",
        delivered: "Delivered",
        cancelled: "Cancelled",
        out_of_stock: "Out of Stock",
        archived: "Archived",
        pricingInventory: "Pricing & Inventory"
    },
    fr: {
        pending: "En attente",
        delivered: "Livré",
        cancelled: "Annulé",
        out_of_stock: "Rupture de stock",
        archived: "Archivé",
        pricingInventory: "Prix et Inventaire"
    },
    ar: {
        pending: "قيد الانتظار",
        delivered: "تم التوصيل",
        cancelled: "ملغي",
        out_of_stock: "نفذت الكمية",
        archived: "مؤرشف",
        pricingInventory: "التسعير والمخزون"
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.admin = {
        ...data.admin,
        ...newStatusKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with status keys`);
});
