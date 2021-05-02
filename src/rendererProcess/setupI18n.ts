import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  I18N_LNG_REQUESTED,
  I18N_LNG_RESPONDED,
} from '../common/actions/i18nActions';
import resources from '../common/i18n';
import { request } from '../common/store';
import { fallbackLng } from '../common/utils/fallbackLng';
import { interpolation } from '../common/utils/interpolation';

export const setupI18n = async (): Promise<void> => {
  const lng =
    (await request(
      {
        type: I18N_LNG_REQUESTED,
      },
      I18N_LNG_RESPONDED
    )) ?? undefined;

  await i18next.use(initReactI18next).init({
    lng,
    fallbackLng,
    resources: {
      ...(lng && {
        [lng]: {
          translation: await resources[lng](),
        },
      }),
      [fallbackLng]: {
        translation: await resources[fallbackLng](),
      },
    },
    interpolation,
    initImmediate: true,
  });
};
