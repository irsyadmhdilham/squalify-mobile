import { Action } from "@ngrx/store";
import { agency } from "../../interfaces/agency";

export enum ActionTypes {
  agencyFetch = 'FETCH_AGENCY',
  agencyFetchSuccess = 'FETCH_AGENCY_SUCCESS'
}

export class FetchAgency implements Action {
  readonly type = ActionTypes.agencyFetch;
}

export class FetchAgencySuccess implements Action {
  readonly type = ActionTypes.agencyFetchSuccess;

  constructor(public payload: agency) { }
}

export type ActionUnion = FetchAgency | FetchAgencySuccess;