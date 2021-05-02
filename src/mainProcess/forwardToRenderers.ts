import { WebContents } from 'electron';
import { Middleware, MiddlewareAPI, Dispatch } from 'redux';

import {
  isFSA,
  FluxStandardAction,
  isLocallyScoped,
  hasMeta,
} from '../common/fsa';
import { handle, invoke } from './ipc';

export const forwardToRenderers: Middleware = (api: MiddlewareAPI) => {
  const renderers = new Set<WebContents>();

  handle('redux/get-preloaded-state', async (webContents) => {
    renderers.add(webContents);

    webContents.addListener('destroyed', () => {
      renderers.delete(webContents);
    });

    return api.getState();
  });

  handle('redux/action-dispatched', async (_, action) => {
    api.dispatch(action);
  });

  return (next: Dispatch) => (action: FluxStandardAction<string, unknown>) => {
    if (!isFSA(action) || isLocallyScoped(action)) {
      return next(action);
    }

    const rendererAction = {
      ...action,
      meta: {
        ...(hasMeta(action) && action.meta),
        scope: 'local',
      },
    };

    renderers.forEach((webContents) => {
      invoke(webContents, 'redux/action-dispatched', rendererAction);
    });

    return next(action);
  };
};