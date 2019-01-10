import { profile } from "./profile";
import { inbox } from "./inbox";

export interface notification {
  pk: number;
  notified_by: profile;
  notification_type: string;
  post_rel: number;
  inbox_rel: inbox;
  timestamp: Date;
  read: boolean;
  seen: boolean;
  group_chat: string;
};