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
        personal: !action.personal ? state.personal : state.personal += action.payload,
        agency: state.agency += action.payload,
        group: action.group ? state.group += action.payload : state.group
      };
    case ActionTypes.decrement:
      return {
        personal: !action.personal ? state.personal : state.personal += action.payload,
        agency: state.agency -= action.payload,
        group: action.group ? state.group += action.payload : state.group
      };
    default:
      return state;
  }
}