import { convertToURL } from '../common/convertToURL';
import { invoke } from './ipc';
import { getRootWindow } from './rootWindow';

export const fetchServerInformation = async (
  url: URL
): Promise<[finalURL: URL, version: string]> => {
  const { webContents } = await getRootWindow();
  const [urlHref, version] = await invoke(
    webContents,
    'servers/fetch-info',
    url.href
  );
  return [convertToURL(urlHref), version];
};
