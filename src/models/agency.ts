import { post } from "./post";

export interface owner {
  pk: number;
  name: string;
  profile_image: string;
};

export interface member {
  pk?: number;
  name: string;
  designation: string;
  profile_image: string;
  downline?: number;
};

export interface points {
  agency: number;
  personal: number;
  group: number;
};

export interface agency {
  pk: number;
  name: string;
  owner?: owner;
  industry?: string;
  company: string;
  agency_image: string;
  posts?: post[];
  members?: member[];
  points?: points
};