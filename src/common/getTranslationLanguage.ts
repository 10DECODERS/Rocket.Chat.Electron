import type resources from './i18n';
import { isTranslationLanguage } from './isTranslationLanguage';

export const getTranslationLanguage = (
  locale: string
): keyof typeof resources | undefined => {
  let [languageCode, countryCode] = locale.split(/[-_]/) as [string, string?];
  if (!languageCode || languageCode.length !== 2) {
    return undefined;
  }

  languageCode = languageCode.toLowerCase();

  if (!countryCode || countryCode.length !== 2) {
    countryCode = undefined;
  } else {
    countryCode = countryCode.toUpperCase();
  }

  const lng = countryCode ? `${languageCode}-${countryCode}` : languageCode;

  if (isTranslationLanguage(lng)) {
    return lng;
  }

  return undefined;
};
