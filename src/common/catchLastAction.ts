import { Dispatch, AnyAction } from 'redux';

export let lastAction: AnyAction;

export const catchLastAction = (): ((
  next: Dispatch<AnyAction>
) => (action: any) => any) => (next) => (action) => {
  lastAction = action;
  return next(action);
};
