import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getI18nInitOptions } from '../common/getI18nInitOptions';
import { select } from '../common/store';

export const setupI18n = async (): Promise<void> => {
  const locale = select((state) => state.app.locale);
  await i18next.use(initReactI18next).init(await getI18nInitOptions(locale));
};
