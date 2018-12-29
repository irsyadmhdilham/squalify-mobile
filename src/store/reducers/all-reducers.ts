import { profileReducer } from "./profile.reducer";
import { notificationReducer } from "./notifications.reducer";
import { socketioReduder } from "./socketio.reducer";

export const reducers = {
  profile: profileReducer,
  notifications: notificationReducer,
  io: socketioReduder
};