import { ActionTypes, actionsUnion } from "../actions/notifications.action";

export function notificationReducer(state = 0, action: actionsUnion) {
  switch (action.type) {
    case ActionTypes.initSucceed:
      return state = action.payload;
    case ActionTypes.increment:
      return state += 1;
    case ActionTypes.clear:
      return state = 0;
    default:
      return state;
  }
}