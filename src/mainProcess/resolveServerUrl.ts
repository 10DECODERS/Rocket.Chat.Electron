import { ServerUrlResolutionResult } from '../common/types/ServerUrlResolutionResult';
import { invoke } from './ipc';
import { getRootWindow } from './rootWindow';

export const resolveServerUrl = async (
  input: string
): Promise<ServerUrlResolutionResult> => {
  const { webContents } = await getRootWindow();
  return invoke(webContents, 'servers/resolve-url', input);
};
