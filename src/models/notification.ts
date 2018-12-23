import { profile } from "./profile";

export interface notification {
  notified_by: profile;
  notification_type: string;
  timestamp: string;
}