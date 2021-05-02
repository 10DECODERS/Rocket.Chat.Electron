import { Store } from 'redux';

import { RootState } from './rootReducer';

export let reduxStore: Store<RootState>;

export const withStore = (store: Store<RootState>): void => {
  reduxStore = store;
};
