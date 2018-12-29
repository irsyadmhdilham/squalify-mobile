import { profile } from "./profile";

export interface store {
  profile: profile;
  notifications: number;
  io: any;
}