import Bugsnag from '@bugsnag/js';

import { APP_ERROR_THROWN } from '../common/actions/appActions';
import { select, dispatch } from '../store';
import { whenReady } from './whenReady';

export const setupRendererErrorHandling = async (
  appType: 'rootWindow' | 'webviewPreload'
): Promise<void> => {
  await whenReady();

  if (process.env.BUGSNAG_API_KEY) {
    const apiKey = process.env.BUGSNAG_API_KEY;
    const appVersion = select(({ appVersion }) => appVersion);

    if (!appVersion) {
      throw new Error('app version was not set');
    }

    Bugsnag.start({
      apiKey,
      appVersion,
      appType,
      collectUserIp: false,
      releaseStage: process.env.NODE_ENV,
      ...(appType === 'webviewPreload' && {
        onError: (event) => {
          event.context = window.location.href;
        },
      }),
    });
    return;
  }

  const dispatchError = (error: Error): void => {
    dispatch({
      type: APP_ERROR_THROWN,
      payload: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      error: true,
    });
  };

  window.addEventListener('error', (event): void => {
    dispatchError(event.error);
  });

  window.addEventListener('unhandledrejection', (event): void => {
    dispatchError(event.reason);
  });
};
