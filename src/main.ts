import { app } from 'electron';
import i18next from 'i18next';

import { getI18nInitOptions } from './common/getI18nInitOptions';
import { withStore } from './common/withStore';
import { createMainReduxStore } from './mainProcess/createMainReduxStore';
import {
  setupDeepLinks,
  processDeepLinksInArgs,
} from './mainProcess/deepLinks';
import dock from './mainProcess/dock';
import { setupDownloads } from './mainProcess/downloads';
import menuBar from './mainProcess/menuBar';
import { setupNotifications } from './mainProcess/notifications';
import { performElectronStartup } from './mainProcess/performElectronStartup';
import { createRootWindow, showRootWindow } from './mainProcess/rootWindow';
import { attachGuestWebContentsEvents } from './mainProcess/serverView';
import { setUserDataDirectory } from './mainProcess/setUserDataDirectory';
import { setupApp } from './mainProcess/setupApp';
import { setupErrorHandling } from './mainProcess/setupErrorHandling';
import { setupNavigation } from './mainProcess/setupNavigation';
import { setupPowerMonitor } from './mainProcess/setupPowerMonitor';
import { setupScreenSharing } from './mainProcess/setupScreenSharing';
import { setupServers } from './mainProcess/setupServers';
import { setupSpellChecking } from './mainProcess/setupSpellChecking';
import touchBar from './mainProcess/touchBar';
import trayIcon from './mainProcess/trayIcon';
import { setupUpdates } from './mainProcess/updates';
import { watchAndPersistChanges } from './mainProcess/watchAndPersistChanges';

const start = async (): Promise<void> => {
  setUserDataDirectory();
  setupErrorHandling();
  performElectronStartup();

  await app.whenReady();

  withStore(await createMainReduxStore());

  await i18next.init(await getI18nInitOptions(app.getLocale()));

  createRootWindow();
  attachGuestWebContentsEvents();
  await showRootWindow();

  // React DevTools is currently incompatible with Electron 10
  // if (process.env.NODE_ENV === 'development') {
  //   installDevTools();
  // }

  setupApp();
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
};

if (require.main === module) {
  start();
}
