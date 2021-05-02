import {
  DOWNLOAD_CREATED,
  DOWNLOAD_REMOVED,
  DOWNLOAD_UPDATED,
} from '../actions/downloadsActions';
import { ActionOf } from '../rootAction';
import { Download } from '../types/Download';

type DownloadsAction =
  | ActionOf<typeof DOWNLOAD_CREATED>
  | ActionOf<typeof DOWNLOAD_UPDATED>
  | ActionOf<typeof DOWNLOAD_REMOVED>;

export const downloads = (
  state: Record<Download['itemId'], Download> = {},
  action: DownloadsAction
): Record<Download['itemId'], Download> => {
  switch (action.type) {
    case DOWNLOAD_CREATED: {
      const download = action.payload;
      return {
        ...state,
        [download.itemId]: download,
      };
    }

    case DOWNLOAD_UPDATED: {
      const newState = { ...state };
      newState[action.payload.itemId] = {
        ...newState[action.payload.itemId],
        ...action.payload,
      };
      return newState;
    }

    case DOWNLOAD_REMOVED: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }

    default:
      return state;
  }
};