import { AppActionTypeToPayloadMap } from './actions/appActions';
import { DeepLinksActionTypeToPayloadMap } from './actions/deepLinksActions';
import { DownloadsActionTypeToPayloadMap } from './actions/downloadsActions';
import { I18nActionTypeToPayloadMap } from './actions/i18nActions';
import { NavigationActionTypeToPayloadMap } from './actions/navigationActions';
import { NotificationsActionTypeToPayloadMap } from './actions/notificationsActions';
import { ScreenSharingActionTypeToPayloadMap } from './actions/screenSharingActions';
import { ServersActionTypeToPayloadMap } from './actions/serversActions';
import { SpellCheckingActionTypeToPayloadMap } from './actions/spellCheckingActions';
import { UiActionTypeToPayloadMap } from './actions/uiActions';
import { UpdatesActionTypeToPayloadMap } from './actions/updatesActions';
import { UserPresenceActionTypeToPayloadMap } from './actions/userPresenceActions';

type ActionTypeToPayloadMap = AppActionTypeToPayloadMap &
  DeepLinksActionTypeToPayloadMap &
  DownloadsActionTypeToPayloadMap &
  I18nActionTypeToPayloadMap &
  NavigationActionTypeToPayloadMap &
  NotificationsActionTypeToPayloadMap &
  ScreenSharingActionTypeToPayloadMap &
  ServersActionTypeToPayloadMap &
  SpellCheckingActionTypeToPayloadMap &
  UiActionTypeToPayloadMap &
  UpdatesActionTypeToPayloadMap &
  UserPresenceActionTypeToPayloadMap;

type RootActions = {
  [Type in keyof ActionTypeToPayloadMap]: void extends ActionTypeToPayloadMap[Type]
    ? {
        type: Type;
      }
    : {
        type: Type;
        payload: ActionTypeToPayloadMap[Type];
      };
};

export type ActionOf<Type extends keyof RootActions> = RootActions[Type];

export type RootAction = RootActions[keyof RootActions];
