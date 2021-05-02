import { Server } from './Server';
import { ServerUrlResolutionStatus } from './ServerUrlResolutionStatus';

export type ServerUrlResolutionResult =
  | [resolvedServerUrl: Server['url'], result: ServerUrlResolutionStatus.OK]
  | [
      resolvedServerUrl: Server['url'],
      result: Exclude<ServerUrlResolutionStatus, 'OK'>,
      error: Error
    ];
