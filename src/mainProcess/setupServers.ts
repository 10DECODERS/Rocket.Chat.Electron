import {
  SERVER_URL_RESOLUTION_REQUESTED,
  SERVER_URL_RESOLVED,
} from '../common/actions/serversActions';
import { dispatch, listen } from '../store';
import { hasMeta } from '../store/fsa';
import { resolveServerUrl } from './resolveServerUrl';

export const setupServers = async (): Promise<void> => {
  listen(SERVER_URL_RESOLUTION_REQUESTED, async (action) => {
    if (!hasMeta(action)) {
      return;
    }

    try {
      dispatch({
        type: SERVER_URL_RESOLVED,
        payload: await resolveServerUrl(action.payload),
        meta: {
          response: true,
          id: action.meta.id,
        },
      });
    } catch (error) {
      dispatch({
        type: SERVER_URL_RESOLVED,
        payload: error,
        error: true,
        meta: {
          response: true,
          id: action.meta.id,
        },
      });
    }
  });
};
