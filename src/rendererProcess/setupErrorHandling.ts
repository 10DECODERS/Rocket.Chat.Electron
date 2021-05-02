import Bugsnag from '@bugsnag/js';

import { select } from '../common/store';

export const setupErrorHandling = (
  appType: 'rootWindow' | 'webviewPreload'
): void => {
  const { appVersion, bugsnagApiKey } = select((state) => ({
    appVersion: state.app.version,
    bugsnagApiKey: state.app.bugsnagApiKey,
  }));

  if (bugsnagApiKey) {
    Bugsnag.start({
      apiKey: bugsnagApiKey,
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
  }
};
