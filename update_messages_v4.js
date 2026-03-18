const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const extraKeys = {
    common: {
        contactUs: {
            en: "Contact Us",
            fr: "Contactez-nous",
            ar: "اتصل بنا"
        },
        sendMessage: {
            en: "Send us a message",
            fr: "Envoyez-nous un message",
            ar: "أرسل لنا رسالة"
        },
        contactInfo: {
            en: "Contact Information",
            fr: "Informations de contact",
            ar: "معلومات الاتصال"
        },
        address: {
            en: "Address",
            fr: "Adresse",
            ar: "العنوان"
        },
        locationValue: {
            en: "Kairouan, Tunisia",
            fr: "Kairouan, Tunisie",
            ar: "القيروان، تونس"
        },
        phone: {
            en: "Phone",
            fr: "Téléphone",
            ar: "الهاتف"
        },
        email: {
            en: "Email",
            fr: "Email",
            ar: "البريد الإلكتروني"
        },
        businessHours: {
            en: "Business Hours",
            fr: "Heures d'ouverture",
            ar: "ساعات العمل"
        },
        hoursWeek: {
            en: "Saturday - Thursday: 9:00 AM - 6:00 PM",
            fr: "Samedi - Jeudi: 9h00 - 18h00",
            ar: "السبت - الخميس: 9:00 ص - 6:00 م"
        },
        hoursFriday: {
            en: "Friday: Closed",
            fr: "Vendredi: Fermé",
            ar: "الجمعة: مغلق"
        },
        noResults: {
            en: "No matches found",
            fr: "Aucun résultat trouvé",
            ar: "لا توجد نتائج مطابقة"
        }
    }
};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update common namespace
    if (!messages.common) messages.common = {};
    Object.keys(extraKeys.common).forEach(key => {
        messages.common[key] = extraKeys.common[key][locale];
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
});
