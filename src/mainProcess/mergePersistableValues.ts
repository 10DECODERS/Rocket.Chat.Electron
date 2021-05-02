import { RootState } from '../common/rootReducer';
import { selectPersistableValues } from '../common/selectPersistableValues';
import { PersistableValues } from '../common/types/PersistableValues';
import { joinUserPath } from './joinUserPath';
import { getPersistedValues } from './persistence';
import { readJsonObject } from './readJsonObject';

const extractPersistableValues = ({
  currentView,
  doCheckForUpdatesOnStartup,
  downloads,
  externalProtocols,
  isEachUpdatesSettingConfigurable,
  isMenuBarEnabled,
  isShowWindowOnUnreadChangedEnabled,
  isSideBarEnabled,
  isTrayIconEnabled,
  isUpdatingEnabled,
  rootWindowState,
  servers,
  skippedUpdateVersion,
  trustedCertificates,
}: PersistableValues): PersistableValues => ({
  currentView,
  doCheckForUpdatesOnStartup,
  downloads,
  externalProtocols,
  isEachUpdatesSettingConfigurable,
  isMenuBarEnabled,
  isShowWindowOnUnreadChangedEnabled,
  isSideBarEnabled,
  isTrayIconEnabled,
  isUpdatingEnabled,
  rootWindowState,
  servers,
  skippedUpdateVersion,
  trustedCertificates,
});

export const mergePersistableValues = async (
  state: RootState,
  localStorage: Record<string, string>
): Promise<RootState> => {
  const initialValues = selectPersistableValues(state);

  const electronStoreValues = getPersistedValues();

  const localStorageValues = Object.fromEntries(
    Object.entries(localStorage).map(([key, value]) => {
      try {
        return [key, JSON.parse(value)];
      } catch (error) {
        return [];
      }
    })
  ) as Record<string, unknown>;

  let values = extractPersistableValues({
    ...initialValues,
    ...electronStoreValues,
    ...localStorageValues,
  });

  if (localStorage.autohideMenu) {
    values = {
      ...values,
      isMenuBarEnabled: localStorage.autohideMenu !== 'true',
    };
  }

  if (localStorage.showWindowOnUnreadChanged) {
    values = {
      ...values,
      isShowWindowOnUnreadChangedEnabled:
        localStorage.showWindowOnUnreadChanged === 'true',
    };
  }

  if (localStorage['sidebar-closed']) {
    values = {
      ...values,
      isSideBarEnabled: localStorage['sidebar-closed'] !== 'true',
    };
  }

  if (localStorage.hideTray) {
    values = {
      ...values,
      isTrayIconEnabled: localStorage.hideTray !== 'true',
    };
  }

  const filePath = joinUserPath('main-window-state.json');
  const userRootWindowState = await readJsonObject(filePath, { discard: true });

  values = {
    ...values,
    rootWindowState: {
      ...values.rootWindowState,
      focused: true,
      ...(typeof userRootWindowState.isHidden === 'boolean' && {
        visible: !userRootWindowState.isHidden,
      }),
      ...(typeof userRootWindowState.isMaximized === 'boolean' && {
        maximized: userRootWindowState.isMaximized,
      }),
      ...(typeof userRootWindowState.isMinimized === 'boolean' && {
        minimized: userRootWindowState.isMinimized,
      }),
      fullscreen: false,
      ...(!userRootWindowState.isMinimized &&
        !userRootWindowState.isMaximized && {
          normal: true,
        }),
      bounds: {
        ...values.rootWindowState.bounds,
        ...(typeof userRootWindowState.x === 'number' && {
          x: userRootWindowState.x,
        }),
        ...(typeof userRootWindowState.y === 'number' && {
          y: userRootWindowState.y,
        }),
        ...(typeof userRootWindowState.width === 'number' && {
          width: userRootWindowState.width,
        }),
        ...(typeof userRootWindowState.height === 'number' && {
          height: userRootWindowState.height,
        }),
      },
    },
  };

  return {
    ...state,
    currentView: values.currentView,
    doCheckForUpdatesOnStartup: values.doCheckForUpdatesOnStartup,
    downloads: values.downloads,
    externalProtocols: values.externalProtocols,
    isEachUpdatesSettingConfigurable: values.isEachUpdatesSettingConfigurable,
    isMenuBarEnabled: values.isMenuBarEnabled,
    isShowWindowOnUnreadChangedEnabled:
      values.isShowWindowOnUnreadChangedEnabled,
    isSideBarEnabled: values.isSideBarEnabled,
    isTrayIconEnabled: values.isTrayIconEnabled,
    isUpdatingEnabled: values.isUpdatingEnabled,
    rootWindowState: values.rootWindowState,
    servers: values.servers,
    skippedUpdateVersion: values.skippedUpdateVersion,
    trustedCertificates: values.trustedCertificates,
  };
};