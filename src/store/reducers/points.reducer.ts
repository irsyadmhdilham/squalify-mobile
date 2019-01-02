import { ActionTypes, actionsUnion } from "../actions/points.action";

const initialState = {
  personal: 0,
  group: 0,
  agency: 0
};

export function pointsReducer(state=initialState, action: actionsUnion) {
  switch (action.type) {
    case ActionTypes.initSucceed:
      return state = action.payload;
    case ActionTypes.increment:
      return {
        ...state,
        personal: state.personal += action.payload,
        agency: state.agency += action.payload
      };
    case ActionTypes.decrement:
      return {
        ...state,
        personal: state.personal -= action.payload,
        agency: state.agency -= action.payload
      };
    default:
      return state;
  }
}