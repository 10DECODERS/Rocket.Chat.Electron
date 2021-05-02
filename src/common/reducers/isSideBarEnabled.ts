import { Reducer } from 'redux';

import { MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED } from '../actions/uiActions';
import { ActionOf } from '../rootAction';

type IsSideBarEnabledAction = ActionOf<
  typeof MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED
>;

export const isSideBarEnabled: Reducer<boolean, IsSideBarEnabledAction> = (
  state = true,
  action
) => {
  switch (action.type) {
    case MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED:
      return action.payload;

    default:
      return state;
  }
};
