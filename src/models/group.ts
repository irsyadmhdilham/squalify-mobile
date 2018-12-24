export interface member {
  pk?: number;
  name: string;
  designation: string;
  profile_image: string;
  downline?: number;
};

export interface group {
  pk: number;
  owner: string;
  members: member[];
};