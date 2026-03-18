const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];
const loginKeys = {
    en: {
        adminLogin: "Admin Login",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        signingIn: "Signing in...",
        invalidCredentials: "Invalid email or password",
        genericError: "An error occurred. Please try again."
    },
    fr: {
        adminLogin: "Connexion Admin",
        email: "Email",
        password: "Mot de passe",
        signIn: "Se connecter",
        signingIn: "Connexion en cours...",
        invalidCredentials: "Email ou mot de passe invalide",
        genericError: "Une erreur est survenue. Veuillez réessayer."
    },
    ar: {
        adminLogin: "تسجيل دخول المشرف",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        signIn: "تسجيل الدخول",
        signingIn: "جاري الدخول...",
        invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        genericError: "حدث خطأ. يرجى المحاولة مرة أخرى."
    }
};

locales.forEach(locale => {
    const filePath = path.join(__dirname, 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.admin = {
        ...data.admin,
        ...loginKeys[locale]
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${locale}.json with login keys`);
});
