import resources from './i18n';

export const isTranslationLanguage = (
  lng: string
): lng is keyof typeof resources => lng in resources;
