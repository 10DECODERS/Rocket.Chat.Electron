import { AnyAction } from 'redux';

import { rootReducer, RootState } from './rootReducer';

export const getInitialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT' } as AnyAction);
