import { WebContents } from 'electron';

import { joinAsarPath } from './joinAsarPath';

export const setupPreloadReload = async (
  webContents: WebContents
): Promise<void> => {
  const chokidar = await import('chokidar');
  chokidar
    .watch([joinAsarPath('preload.js'), joinAsarPath('injected.js')], {
      awaitWriteFinish: true,
    })
    .on('change', () => {
      if (webContents.isDestroyed()) {
        return;
      }

      console.log('Reloading webview...');
      webContents.reload();
    });
};
