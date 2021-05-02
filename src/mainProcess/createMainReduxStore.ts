import { applyMiddleware, createStore, Store } from 'redux';

import { catchLastAction } from '../common/catchLastAction';
import { rootReducer, RootState } from '../common/rootReducer';
import { forwardToRenderers } from '../store/ipc';

export const createMainReduxStore = async (): Promise<Store<RootState>> =>
  createStore(
    rootReducer,
    undefined,
    applyMiddleware(catchLastAction, forwardToRenderers)
  );
