import { applyMiddleware, createStore, Store, compose } from 'redux';

import { catchLastAction } from '../common/catchLastAction';
import { rootReducer, RootState } from '../common/rootReducer';
import { forwardToMain } from './forwardToMain';
import { getPreloadedState } from './getPreloadedState';

const hasDevToolsCompose = (
  window: Window
): window is Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
} =>
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__' in window &&
  typeof (window as {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function';

const composeEnhancers = hasDevToolsCompose(window)
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

export const createRendererReduxStore = async (): Promise<Store<RootState>> =>
  createStore(
    rootReducer,
    await getPreloadedState(),
    composeEnhancers(applyMiddleware(forwardToMain, catchLastAction))
  );
