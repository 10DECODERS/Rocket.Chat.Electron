import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { withStore } from './common/withStore';
import { App } from './rendererProcess/components/App';
import { createRendererReduxStore } from './rendererProcess/createRendererReduxStore';
import { setupErrorHandling } from './rendererProcess/setupErrorHandling';
import { setupI18n } from './rendererProcess/setupI18n';
import { whenReady } from './rendererProcess/whenReady';

const start = async (): Promise<void> => {
  const reduxStore = await createRendererReduxStore();
  withStore(reduxStore);

  await whenReady();

  setupErrorHandling('rootWindow');
  await setupI18n();

  (
    await Promise.all([
      import('./rendererProcess/notifications'),
      import('./rendererProcess/servers'),
    ])
  ).forEach((module) => module.default());

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('cannot find the container node for React');
  }

  render(createElement(App, { reduxStore }), container);

  window.addEventListener('beforeunload', () => {
    unmountComponentAtNode(container);
  });
};

start();
