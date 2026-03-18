const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const extraKeys = {
    home: {
        featuredTitle: {
            en: "Featured Products",
            fr: "Nos produits en vedette",
            ar: "منتجاتنا المميزة"
        },
        ourStory: {
            en: "Our Story",
            fr: "Notre histoire",
            ar: "قصتنا"
        },
        storyContent: {
            en: "Makroudh Omrani is a family project that started many years ago, specializing in making authentic Tunisian makroudh using our grandmothers' recipe. We use the finest natural ingredients and preserve traditional preparation methods.",
            fr: "Makroudh Omrani est un projet familial qui a commencé il y a de nombreuses années, spécialisé dans la fabrication de makroudh tunisien authentique selon la recette de nos grands-mères. Nous utilisons les meilleurs ingrédients naturels et préservons les méthodes traditionnelles de préparation.",
            ar: "مقروض العمراني هو مشروع عائلي بدأ منذ سنوات عديدة، متخصص في صناعة المقروض التونسي الأصيل بوصفة جداتنا. نستخدم أجود المكونات الطبيعية ونحافظ على الطرق التقليدية في التحضير."
        },
        learnMore: {
            en: "Learn More",
            fr: "En savoir plus",
            ar: "اقرأ المزيد"
        },
        viewAllProducts: {
            en: "View All Products",
            fr: "Voir tous les produits",
            ar: "عرض جميع المنتجات"
        }
    },
    product: {
        new: {
            en: "New",
            fr: "Nouveau",
            ar: "جديد"
        },
        featured: {
            en: "Featured",
            fr: "En vedette",
            ar: "مميز"
        },
        outOfStock: {
            en: "Out of Stock",
            fr: "Rupture de stock",
            ar: "نفذت الكمية"
        },
        unavailable: {
            en: "Unavailable",
            fr: "Indisponible",
            ar: "غير متاح"
        },
        noImage: {
            en: "No Image",
            fr: "Pas d'image",
            ar: "لا توجد صورة"
        },
        viewDetails: {
            en: "View Details",
            fr: "Voir les détails",
            ar: "عرض التفاصيل"
        }
    }
};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update home namespace
    if (!messages.home) messages.home = {};
    Object.keys(extraKeys.home).forEach(key => {
        messages.home[key] = extraKeys.home[key][locale];
    });

    // Update product namespace
    if (!messages.product) messages.product = {};
    Object.keys(extraKeys.product).forEach(key => {
        messages.product[key] = extraKeys.product[key][locale];
    });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
});
