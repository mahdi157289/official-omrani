const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const extraKeys = {
    footer: {
        tagline: {
            en: "The taste of authentic tradition",
            fr: "Le goût de la tradition authentique",
            ar: "طعم التقليد الأصيل"
        },
        quickLinks: {
            en: "Quick Links",
            fr: "Liens rapides",
            ar: "روابط سريعة"
        },
        customerService: {
            en: "Customer Service",
            fr: "Service client",
            ar: "خدمة العملاء"
        },
        rightsReserved: {
            en: "All rights reserved",
            fr: "Tous droits réservés",
            ar: "جميع الحقوق محفوظة"
        },
        shipping: {
            en: "Shipping",
            fr: "Livraison",
            ar: "الشحن والتوصيل"
        }
    },
    common: {
        dashboard: {
            en: "Dashboard",
            fr: "Tableau de bord",
            ar: "لوحة الإدارة"
        }
    }
};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update footer namespace
    if (!messages.footer) messages.footer = {};
    Object.keys(extraKeys.footer).forEach(key => {
        messages.footer[key] = extraKeys.footer[key][locale];
    });

    // Update common namespace
    if (!messages.common) messages.common = {};
    Object.keys(extraKeys.common).forEach(key => {
        messages.common[key] = extraKeys.common[key][locale];
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
});
