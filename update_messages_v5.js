const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const extraKeys = {
    contact: {
        success: {
            en: "Thank you! Your message has been sent successfully.",
            fr: "Merci! Votre message a été envoyé avec succès.",
            ar: "شكراً لك! تم إرسال رسالتك بنجاح."
        },
        name: {
            en: "Name",
            fr: "Nom",
            ar: "الاسم"
        },
        email: {
            en: "Email",
            fr: "Email",
            ar: "البريد الإلكتروني"
        },
        phone: {
            en: "Phone",
            fr: "Téléphone",
            ar: "الهاتف"
        },
        subject: {
            en: "Subject",
            fr: "Sujet",
            ar: "الموضوع"
        },
        message: {
            en: "Message",
            fr: "Message",
            ar: "الرسالة"
        },
        sending: {
            en: "Sending...",
            fr: "Envoi en cours...",
            ar: "جاري الإرسال..."
        },
        send: {
            en: "Send Message",
            fr: "Envoyer",
            ar: "إرسال"
        }
    }
};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update contact namespace
    if (!messages.contact) messages.contact = {};
    Object.keys(extraKeys.contact).forEach(key => {
        messages.contact[key] = extraKeys.contact[key][locale];
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
});
