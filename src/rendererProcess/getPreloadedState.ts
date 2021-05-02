import { invoke } from './ipc';

export const getPreloadedState = (): Promise<any> =>
  invoke('redux/get-initial-state');
