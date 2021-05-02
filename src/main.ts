import { app } from 'electron';
import i18next from 'i18next';

import { APP_ERROR_THROWN } from './common/actions/appActions';
import {
  I18N_LNG_REQUESTED,
  I18N_LNG_RESPONDED,
} from './common/actions/i18nActions';
import { getInitialState } from './common/getInitialState';
import { getTranslationLanguage } from './common/getTranslationLanguage';
import resources from './common/i18n';
import { isTranslationLanguage } from './common/isTranslationLanguage';
import { fallbackLng } from './common/utils/fallbackLng';
import { interpolation } from './common/utils/interpolation';
import { withStore } from './common/withStore';
import { createMainReduxStore } from './mainProcess/createMainReduxStore';
import {
  setupDeepLinks,
  processDeepLinksInArgs,
} from './mainProcess/deepLinks';
import dock from './mainProcess/dock';
import { setupDownloads } from './mainProcess/downloads';
import { exportLocalStorage } from './mainProcess/exportLocalStorage';
import menuBar from './mainProcess/menuBar';
import { mergePersistableValues } from './mainProcess/mergePersistableValues';
import { mergeServers } from './mainProcess/mergeServers';
import { mergeTrustedCertificates } from './mainProcess/mergeTrustedCertificates';
import { mergeUpdatesConfiguration } from './mainProcess/mergeUpdatesConfiguration';
import { setupNotifications } from './mainProcess/notifications';
import { performElectronStartup } from './mainProcess/performElectronStartup';
import { createRootWindow, showRootWindow } from './mainProcess/rootWindow';
import { attachGuestWebContentsEvents } from './mainProcess/serverView';
import { setUserDataDirectory } from './mainProcess/setUserDataDirectory';
import { setupApp } from './mainProcess/setupApp';
import { setupMainErrorHandling } from './mainProcess/setupMainErrorHandling';
import { setupNavigation } from './mainProcess/setupNavigation';
import { setupPowerMonitor } from './mainProcess/setupPowerMonitor';
import { setupScreenSharing } from './mainProcess/setupScreenSharing';
import { setupServers } from './mainProcess/setupServers';
import { setupSpellChecking } from './mainProcess/setupSpellChecking';
import touchBar from './mainProcess/touchBar';
import trayIcon from './mainProcess/trayIcon';
import { setupUpdates } from './mainProcess/updates';
import { watchAndPersistChanges } from './mainProcess/watchAndPersistChanges';
import { dispatch, listen } from './store';
import { hasMeta } from './store/fsa';

const start = async (): Promise<void> => {
  setUserDataDirectory();
  setupMainErrorHandling();
  performElectronStartup();

  withStore(await createMainReduxStore());

  await app.whenReady();

  const localStorage = await exportLocalStorage();
  await Promise.resolve(getInitialState())
    .then((state) => mergePersistableValues(state, localStorage))
    .then((state) => mergeServers(state, localStorage))
    .then((state) => mergeUpdatesConfiguration(state))
    .then((state) => mergeTrustedCertificates(state));

  const lng = getTranslationLanguage(app.getLocale());

  await i18next.init({
    lng,
    fallbackLng,
    resources: {
      ...(lng &&
        lng in resources && {
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

  setupApp();

  createRootWindow();
  attachGuestWebContentsEvents();
  await showRootWindow();

  // React DevTools is currently incompatible with Electron 10
  // if (process.env.NODE_ENV === 'development') {
  //   installDevTools();
  // }

  setupNotifications();
  setupScreenSharing();
  setupSpellChecking();
  setupDeepLinks();
  setupNavigation();
  setupPowerMonitor();
  setupUpdates();
  setupDownloads();
  setupServers();

  dock.setUp();
  menuBar.setUp();
  touchBar.setUp();
  trayIcon.setUp();

  app.once('before-quit', () => {
    dock.tearDown();
    menuBar.tearDown();
    touchBar.tearDown();
    trayIcon.tearDown();
  });

  watchAndPersistChanges();

  await processDeepLinksInArgs();

  listen(APP_ERROR_THROWN, (action) => {
    console.error(action.payload);
  });

  listen(I18N_LNG_REQUESTED, (action) => {
    if (!hasMeta(action) || !action.meta.id) {
      return;
    }

    dispatch({
      type: I18N_LNG_RESPONDED,
      payload: isTranslationLanguage(i18next.language)
        ? i18next.language
        : undefined,
      meta: {
        response: true,
        id: action.meta?.id,
      },
    });
  });
};

if (require.main === module) {
  start();
}
