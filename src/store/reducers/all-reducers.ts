import { profileReducer } from "./profile.reducer";
import { notificationReducer } from "./notifications.reducer";
import { socketioReduder } from "./socketio.reducer";
import { pointsReducer } from "./points.reducer";

export const reducers = {
  profile: profileReducer,
  notifications: notificationReducer,
  io: socketioReduder,
  points: pointsReducer
};