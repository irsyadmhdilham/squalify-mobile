import { Action } from "@ngrx/store";
import { profile } from "../../interfaces/profile";

export enum ActionTypes {
  fetch = 'FETCH_PROFILE',
  fetchSucceed = 'FETCH_PROFILE_SUCCEED'
}

export class Fetch implements Action {
  readonly type = ActionTypes.fetch;
}

export class FetchSucceed implements Action {
  readonly type = ActionTypes.fetchSucceed;

  constructor(public payload: profile) { }
}

export type ActionUnion = Fetch | FetchSucceed;