import { ActionTypes, actionsUnion } from "../actions/socketio.action";

export function socketioReduder(state, action: actionsUnion) {
  switch (action.type) {
    case ActionTypes.init:
      return state = action.payload;
    case ActionTypes.reset:
      return state = undefined;
    default:
      return state;
  }
}