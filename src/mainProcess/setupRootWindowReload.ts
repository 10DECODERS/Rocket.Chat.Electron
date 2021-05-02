import { WebContents } from 'electron';

import { joinAsarPath } from './joinAsarPath';

export const setupRootWindowReload = async (
  webContents: WebContents
): Promise<void> => {
  const chokidar = await import('chokidar');
  chokidar
    .watch(joinAsarPath('rootWindow.js'), {
      awaitWriteFinish: true,
    })
    .on('change', () => {
      if (webContents.isDestroyed()) {
        return;
      }

      console.log('Reloading root window...');
      webContents.reload();
    });
};
