import { settings } from "./profile-settings";

interface group {
  pk: number;
  members: number[];
}

interface upline {
  pk: number;
  name: string;
  members: number[];
}

export interface profile {
  pk: number;
  name: string;
  designation: string;
  profile_image: string;
  upline?: upline; 
  group?: group;
  agency: {
    pk: number;
    agency_image: string;
    name: string;
    company: string;
    members: number[];
  };
  settings?: settings;
};