import { Action, ActionCreator } from 'redux';

import { DeepLinksActionTypeToPayloadMap } from './actions/deepLinksActions';
import { DownloadsActionTypeToPayloadMap } from './actions/downloadsActions';
import { NavigationActionTypeToPayloadMap } from './actions/navigationActions';
import { NotificationsActionTypeToPayloadMap } from './actions/notificationsActions';
import type * as screenSharingActions from './actions/screenSharingActions';
import { SpellCheckingActionTypeToPayloadMap } from './actions/spellCheckingActions';
import { UiActionTypeToPayloadMap } from './actions/uiActions';
import type * as updateActions from './actions/updateActions';
import type * as updateCheckActions from './actions/updateCheckActions';
import { UserPresenceActionTypeToPayloadMap } from './actions/userPresenceActions';

type ActionTypeToPayloadMap = DeepLinksActionTypeToPayloadMap &
  DownloadsActionTypeToPayloadMap &
  NavigationActionTypeToPayloadMap &
  NotificationsActionTypeToPayloadMap &
  SpellCheckingActionTypeToPayloadMap &
  UiActionTypeToPayloadMap &
  UserPresenceActionTypeToPayloadMap;

type ActionsFromModule<Module> = {
  [Field in keyof Module as Module[Field] extends ActionCreator<infer A>
    ? A extends Action<infer Type>
      ? Type
      : never
    : never]: Module[Field] extends ActionCreator<infer A> ? A : never;
};

type RootActions = {
  [Type in keyof ActionTypeToPayloadMap]: void extends ActionTypeToPayloadMap[Type]
    ? {
        type: Type;
      }
    : {
        type: Type;
        payload: ActionTypeToPayloadMap[Type];
      };
} &
  ActionsFromModule<typeof screenSharingActions> &
  ActionsFromModule<typeof updateCheckActions> &
  ActionsFromModule<typeof updateActions>;

export type ActionOf<Type extends keyof RootActions> = RootActions[Type];

export type RootAction = RootActions[keyof RootActions];
