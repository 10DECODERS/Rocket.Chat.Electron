import { Middleware, MiddlewareAPI, Dispatch } from 'redux';

import { isFSA, FluxStandardAction, isLocallyScoped } from '../common/fsa';
import {
  handle as handleFromRenderer,
  invoke as invokeFromRenderer,
} from './ipc';

export const forwardToMain: Middleware = (api: MiddlewareAPI) => {
  handleFromRenderer('redux/action-dispatched', async (action) => {
    api.dispatch(action);
  });

  return (next: Dispatch) => (action: FluxStandardAction<string, unknown>) => {
    if (!isFSA(action) || isLocallyScoped(action)) {
      return next(action);
    }

    invokeFromRenderer('redux/action-dispatched', action);
    return action;
  };
};
