import Bugsnag from '@bugsnag/js';
import { app, dialog } from 'electron';

export const setupErrorHandling = (): void => {
  if (process.env.BUGSNAG_API_KEY) {
    Bugsnag.start({
      apiKey: process.env.BUGSNAG_API_KEY,
      appVersion: app.getVersion(),
      appType: 'main',
      collectUserIp: false,
      releaseStage: process.env.NODE_ENV,
    });
    return;
  }

  process.addListener('uncaughtException', (error) => {
    dialog.showErrorBox(error.name, error.message);
    app.exit(1);
  });

  process.addListener('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    dialog.showErrorBox(error.name, error.message);
    app.exit(1);
  });
};
