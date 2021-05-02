import { join } from 'path';

import { app } from 'electron';

export const setUserDataDirectory = (): void => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  app.setPath(
    'userData',
    join(app.getPath('appData'), `${app.name} (development)`)
  );
};
