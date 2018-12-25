import { Action } from "@ngrx/store";

export enum ActionTypes {
  increment = 'NOTIFICATIONS_INCREMENT',
  clear = 'NOTIFICATIONS_CLEAR'
}

export class Increment implements Action {
  readonly type = ActionTypes.increment;
}

export class Clear implements Action {
  readonly type = ActionTypes.clear;
}

export type actionsUnion = Increment | Clear;