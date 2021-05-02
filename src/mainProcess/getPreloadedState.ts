import { getInitialState } from '../common/getInitialState';
import { RootState } from '../common/rootReducer';
import { exportLocalStorage } from './exportLocalStorage';
import { mergeAppInformation } from './mergeAppInformation';
import { mergePersistableValues } from './mergePersistableValues';
import { mergeServers } from './mergeServers';
import { mergeTrustedCertificates } from './mergeTrustedCertificates';
import { mergeUpdatesConfiguration } from './mergeUpdatesConfiguration';

export const getPreloadedState = async (): Promise<Partial<RootState>> => {
  const localStorage = await exportLocalStorage();
  return Promise.resolve(getInitialState())
    .then((state) => mergeAppInformation(state))
    .then((state) => mergePersistableValues(state, localStorage))
    .then((state) => mergeServers(state, localStorage))
    .then((state) => mergeUpdatesConfiguration(state))
    .then((state) => mergeTrustedCertificates(state));
};
