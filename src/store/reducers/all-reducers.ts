import { profileReducer } from "./profile.reducer";
import { notificationReducer } from "./notifications.reducer";

export const reducers = {
  profile: profileReducer,
  notifications: notificationReducer
};