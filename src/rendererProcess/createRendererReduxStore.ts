import { configureStore } from '@reduxjs/toolkit';
import type { Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { catchLastAction } from '../common/catchLastAction';
import { rootReducer, RootState } from '../common/rootReducer';
import { forwardToMain } from './forwardToMain';
import { getPreloadedState } from './getPreloadedState';

export const createRendererReduxStore = async <
  GF extends (...args: any[]) => Generator
>(
  rootSaga?: GF,
  ...args: Parameters<GF>
): Promise<Store<RootState>> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: await getPreloadedState(),
    middleware: [forwardToMain, sagaMiddleware, catchLastAction],
  });

  if (rootSaga) {
    sagaMiddleware.run(rootSaga, ...args);
  }

  return store;
};
