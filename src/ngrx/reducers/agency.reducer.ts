import { ActionTypes, ActionUnion } from "../actions/agency.action";

const initialState = {
  pk: 0,
  name: '',
  agency_image: '',
  company: ''
};

export function agencyReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.agencyFetch:
      return state;
    case ActionTypes.agencyFetchSuccess:
      return state = action.payload;
    default:
      return state;
  }
}