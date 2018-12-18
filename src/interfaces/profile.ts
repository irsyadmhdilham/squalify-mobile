import { settings } from "./profile-settings";

export interface profile {
  pk: number;
  group: number;
  name: string;
  designation: string;
  profile_image: string;
  upline?: string; 
  group_upline: number;
  agency: {
    pk: number;
    agency_image: string;
    name: string;
    company: string;
  },
  settings: settings;
}