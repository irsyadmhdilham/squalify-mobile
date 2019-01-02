import { profile } from "./profile";
import { allPoints } from "./point";

export interface store {
  profile: profile;
  notifications: number;
  io: any;
  points: allPoints;
}