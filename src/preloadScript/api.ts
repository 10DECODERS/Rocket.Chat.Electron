import { Server } from '../common/types/Server';
import { setBadge } from './badge';
import { setFavicon } from './favicon';
import { createNotification, destroyNotification } from './notifications';
import { setBackground } from './sidebar';
import { setTitle } from './title';
import { setUrlResolver } from './urls';
import { setUserPresenceDetection } from './userPresence';

type ServerInfo = {
  version: string;
};

export let serverInfo: ServerInfo;

export type RocketChatDesktopAPI = {
  setServerInfo: (serverInfo: ServerInfo) => void;
  setUrlResolver: (getAbsoluteUrl: (relativePath?: string) => string) => void;
  setBadge: (badge: Server['badge']) => void;
  setFavicon: (faviconUrl: string) => void;
  setBackground: (imageUrl: string) => void;
  setTitle: (title: string) => void;
  setUserPresenceDetection: (options: {
    isAutoAwayEnabled: boolean;
    idleThreshold: number | null;
    setUserOnline: (online: boolean) => void;
  }) => void;
  createNotification: (
    options: NotificationOptions & {
      canReply?: boolean;
      title: string;
      onEvent: (eventDescriptor: { type: string; detail: unknown }) => void;
    }
  ) => Promise<unknown>;
  destroyNotification: (id: unknown) => void;
};

export const RocketChatDesktop: RocketChatDesktopAPI = {
  setServerInfo: (_serverInfo) => {
    serverInfo = _serverInfo;
  },
  setUrlResolver,
  setBadge,
  setFavicon,
  setBackground,
  setTitle,
  setUserPresenceDetection,
  createNotification,
  destroyNotification,
};
