import type { Download } from '../Download';
import { PersistableValues_0_0_0 } from './v0.0.0';

export type PersistableValues_3_1_0 = Omit<
  PersistableValues_0_0_0,
  'currentServerUrl' | 'currentView'
> & {
  currentView:
    | Exclude<PersistableValues_0_0_0['currentView'], null>
    | { url: string }
    | 'downloads';
  downloads: Record<Download['itemId'], Download>;
};
