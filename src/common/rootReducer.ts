import { combineReducers } from 'redux';

import { appReducer } from './reducers/appReducer';
import { currentView } from './reducers/currentView';
import { downloads } from './reducers/downloads';
import { isMenuBarEnabled } from './reducers/isMenuBarEnabled';
import { isMessageBoxFocused } from './reducers/isMessageBoxFocused';
import { isShowWindowOnUnreadChangedEnabled } from './reducers/isShowWindowOnUnreadChangedEnabled';
import { isSideBarEnabled } from './reducers/isSideBarEnabled';
import { isTrayIconEnabled } from './reducers/isTrayIconEnabled';
import {
  clientCertificates,
  externalProtocols,
  trustedCertificates,
} from './reducers/navigationReducers';
import { openDialog } from './reducers/openDialog';
import { rootWindowIcon } from './reducers/rootWindowIcon';
import { rootWindowState } from './reducers/rootWindowState';
import { servers } from './reducers/serversReducers';
import { updatesReducer } from './reducers/updatesReducer';

export const rootReducer = combineReducers({
  app: appReducer,
  updates: updatesReducer,
  clientCertificates,
  currentView,
  downloads,
  externalProtocols,
  isMenuBarEnabled,
  isMessageBoxFocused,
  isShowWindowOnUnreadChangedEnabled,
  isSideBarEnabled,
  isTrayIconEnabled,
  openDialog,
  rootWindowIcon,
  rootWindowState,
  servers,
  trustedCertificates,
});

export type RootState = ReturnType<typeof rootReducer>;
