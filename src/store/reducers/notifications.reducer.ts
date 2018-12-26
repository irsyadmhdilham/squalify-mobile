import { ActionTypes, actionsUnion } from "../actions/notifications.action";

export function notificationReducer(state = 0, action: actionsUnion) {
  switch (action.type) {
    case ActionTypes.initSucceed:
      return state = action.payload;
    case ActionTypes.increment:
      return state += 1;
    case ActionTypes.decrement:
      return state -= 1;
    default:
      return state;
  }
}