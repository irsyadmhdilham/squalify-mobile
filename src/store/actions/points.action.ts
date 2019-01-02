import { Action } from "@ngrx/store";
import { allPoints } from "../../models/point";

export enum ActionTypes {
  init = 'POINTS_INIT',
  initSucceed = 'POINTS_INIT_SUCCEED',
  increment = 'POINTS_INCREMENT',
  decrement = 'POINTS_DECREMENT'
}

export class PointInit implements Action {
  readonly type = ActionTypes.init;
}

export class PointInitSucceed implements Action {
  readonly type = ActionTypes.initSucceed;

  constructor(public payload: allPoints) { }
}

export class PointIncrement implements Action {
  readonly type = ActionTypes.increment;

  constructor(public payload: number) { }
}

export class PointDecrement implements Action {
  readonly type = ActionTypes.decrement;

  constructor(public payload: number) { }
}

export type actionsUnion = PointInit | PointInitSucceed | PointIncrement | PointDecrement;