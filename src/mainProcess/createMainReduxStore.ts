import { configureStore } from '@reduxjs/toolkit';
import type { Store } from 'redux';

import { catchLastAction } from '../common/catchLastAction';
import { rootReducer, RootState } from '../common/rootReducer';
import { forwardToRenderers } from './forwardToRenderers';
import { getPreloadedState } from './getPreloadedState';

export const createMainReduxStore = async (): Promise<Store<RootState>> =>
  configureStore({
    reducer: rootReducer,
    preloadedState: await getPreloadedState(),
    middleware: [catchLastAction, forwardToRenderers],
  });
