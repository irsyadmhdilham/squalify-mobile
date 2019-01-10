import { Action } from "@ngrx/store";

export enum ActionTypes {
  increment = 'NOTIFICATIONS_INCREMENT',
  clear = 'NOTIFICATIONS_CLEAR',
  init = 'NOTIFICATIONS_INIT',
  initSucceed = 'NOTIFICATIONS_INIT_SUCCEED'
}

export class Increment implements Action {
  readonly type = ActionTypes.increment;
}

export class ClearNotifications implements Action {
  readonly type = ActionTypes.clear;
}

export class Init implements Action {
  readonly type = ActionTypes.init;
}

export class InitSucceed implements Action {
  readonly type = ActionTypes.initSucceed;

  constructor(public payload: number) { }
}

export type actionsUnion = Increment | ClearNotifications | Init | InitSucceed;