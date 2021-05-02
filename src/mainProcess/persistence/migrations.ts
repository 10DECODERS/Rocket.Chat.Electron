import { PersistableValues_0_0_0 } from '../../common/types/PersistableValues/v0.0.0';
import { PersistableValues_3_1_0 } from '../../common/types/PersistableValues/v3.1.0';

export const migrations = {
  '>=3.1.0': (before: PersistableValues_0_0_0): PersistableValues_3_1_0 => {
    const { currentServerUrl, ...rest } = before;

    return {
      ...rest,
      currentView: currentServerUrl
        ? { url: currentServerUrl }
        : rest.currentView ?? 'add-new-server',
      downloads: {},
    };
  },
};
