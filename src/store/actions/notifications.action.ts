import { Action } from "@ngrx/store";

export enum ActionTypes {
  increment = 'NOTIFICATIONS_INCREMENT',
  decrement = 'NOTIFICATIONS_DECREMENT',
  init = 'NOTIFICATIONS_INIT',
  initSucceed = 'NOTIFICATIONS_INIT_SUCCEED'
}

export class Increment implements Action {
  readonly type = ActionTypes.increment;
}

export class Decrement implements Action {
  readonly type = ActionTypes.decrement;
}

export class Init implements Action {
  readonly type = ActionTypes.init;
}

export class InitSucceed implements Action {
  readonly type = ActionTypes.initSucceed;

  constructor(public payload: number) { }
}

export type actionsUnion = Increment | Decrement | Init | InitSucceed;