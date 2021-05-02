import { contextBridge } from 'electron';

import { withStore } from './common/withStore';
import {
  RocketChatDesktop,
  RocketChatDesktopAPI,
  serverInfo,
} from './preloadScript/api';
import { JitsiMeetElectron, JitsiMeetElectronAPI } from './preloadScript/jitsi';
import { listenToMessageBoxEvents } from './preloadScript/messageBox';
import { listenToNotificationsRequests } from './preloadScript/notifications';
import { listenToScreenSharingRequests } from './preloadScript/screenSharing';
import { handleTrafficLightsSpacing } from './preloadScript/trafficLights';
import { setServerUrl } from './preloadScript/urls';
import { listenToUserPresenceChanges } from './preloadScript/userPresence';
import { createRendererReduxStore } from './rendererProcess/createRendererReduxStore';
import { invoke } from './rendererProcess/ipc';
import { setupErrorHandling } from './rendererProcess/setupErrorHandling';
import { whenReady } from './rendererProcess/whenReady';

declare global {
  interface Window {
    JitsiMeetElectron: JitsiMeetElectronAPI;
    RocketChatDesktop: RocketChatDesktopAPI;
  }
}

const start = async (): Promise<void> => {
  const serverUrl = await invoke('server-view/get-url');

  if (!serverUrl) {
    return;
  }

  contextBridge.exposeInMainWorld('JitsiMeetElectron', JitsiMeetElectron);
  contextBridge.exposeInMainWorld('RocketChatDesktop', RocketChatDesktop);

  setServerUrl(serverUrl);

  const reduxStore = await createRendererReduxStore();
  withStore(reduxStore);

  await whenReady();

  setupErrorHandling('webviewPreload');

  await invoke('server-view/ready');

  if (!serverInfo) {
    return;
  }

  listenToNotificationsRequests();
  listenToScreenSharingRequests();
  listenToUserPresenceChanges();
  listenToMessageBoxEvents();
  handleTrafficLightsSpacing();
};

start();
