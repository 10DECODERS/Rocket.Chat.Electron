import { BrowserWindow } from 'electron';

import { joinAsarPath } from './joinAsarPath';

export const exportLocalStorage = async (): Promise<Record<string, string>> => {
  try {
    const tempWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        webviewTag: true,
        worldSafeExecuteJavaScript: true,
      },
    });

    tempWindow.loadFile(joinAsarPath('dummy.html'));

    await new Promise<void>((resolve) => {
      tempWindow.once('ready-to-show', () => {
        resolve();
      });
    });

    return await tempWindow.webContents.executeJavaScript(`(() => {
      const data = ({...localStorage})
      localStorage.clear();
      return data;
    })()`);
  } catch (error) {
    console.error(error);
    return {};
  }
};
