import { getTranslations, getLocale } from 'next-intl/server';

/**
 * Helper function to get translations for the admin namespace in server components.
 * This simplifies the call to getTranslations('admin') across search admin pages.
 */
export async function getAdminTranslations() {
    return await getTranslations('admin');
}

/**
 * Helper function to get the current locale in server components.
 */
export async function getAdminLocale() {
    return await getLocale();
}
