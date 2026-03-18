const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const extraKeys = {
    admin: {
        gallery: {
            en: "Store Gallery",
            fr: "Galerie du Magasin",
            ar: "معرض المتجر"
        },
        addItem: {
            en: "Add Item",
            fr: "Ajouter un Élément",
            ar: "إضافة عنصر"
        },
        media: {
            en: "Media Library",
            fr: "Médiathèque",
            ar: "مكتبة الوسائط"
        },
        noMedia: {
            en: "No media files yet. Upload your first image!",
            fr: "Aucun fichier multimédia pour le moment. Téléchargez votre première image !",
            ar: "لا توجد ملفات وسائط حتى الآن. قم بتحميل أول صورة لك!"
        },
        siteConfiguration: {
            en: "Site Configuration",
            fr: "Configuration du Site",
            ar: "تكوين الموقع"
        },
        comingSoon: {
            en: "Settings management coming soon...",
            fr: "La gestion des paramètres arrive bientôt...",
            ar: "إدارة الإعدادات قادمة قريبًا..."
        }
    }
};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    Object.keys(extraKeys.admin).forEach(key => {
        messages.admin[key] = extraKeys.admin[key][locale];
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
});
