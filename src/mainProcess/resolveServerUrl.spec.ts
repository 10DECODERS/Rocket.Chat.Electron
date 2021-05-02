import { ServerUrlResolutionStatus } from '../common/types/ServerUrlResolutionStatus';
import { resolveServerUrl } from './resolveServerUrl';

jest.mock('./rootWindow', () => ({
  __esModule: true,
  getRootWindow: jest.fn(() => ({ webContents: null })),
}));

jest.mock('./ipc', () => ({
  __esModule: true,
  invoke: jest.fn(async (_webContents, channel, ...args) => {
    if (channel === 'servers/fetch-info') {
      return [args[0], '3.8.0'];
    }

    return null;
  }),
}));

it.each([
  ['localhost', 'https://localhost/'],
  ['localhost:3000', 'https://localhost:3000/'],
  ['https://localhost', 'https://localhost/'],
  ['http://localhost', 'http://localhost/'],
  ['https://localhost/', 'https://localhost/'],
  ['http://localhost/', 'http://localhost/'],
  ['https://localhost/subdir', 'https://localhost/subdir/'],
  ['http://localhost:80', 'http://localhost/'],
  ['https://localhost:443', 'https://localhost/'],
])('resolves %s as %s', async (input, expected) => {
  const [serverUrl, status, error] = await resolveServerUrl(input);
  expect(serverUrl).toBe(expected);
  expect(status).toBe(ServerUrlResolutionStatus.OK);
  expect(error).toBe(undefined);
});
