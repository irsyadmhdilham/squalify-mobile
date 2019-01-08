import { Action } from "@ngrx/store";
import { profile } from "../../models/profile";

export enum ActionTypes {
  fetch = 'FETCH_PROFILE',
  fetchSucceed = 'FETCH_PROFILE_SUCCEED',
  agencyNameImage = 'AGENCY_NAME_IMAGE'
}

export class Fetch implements Action {
  readonly type = ActionTypes.fetch;
}

export class FetchSucceed implements Action {
  readonly type = ActionTypes.fetchSucceed;

  constructor(public payload: profile) { }
}

export class AgencyNameImage implements Action {
  readonly type = ActionTypes.agencyNameImage;

  constructor(public payload: { agencyName: string; agencyImage: string; }) { }
}

export type ActionUnion = Fetch | FetchSucceed | AgencyNameImage;