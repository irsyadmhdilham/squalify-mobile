export interface owner {
  pk: number;
  name: string;
  profile_image: string;
}

export interface agency {
  name: string;
  owner?: owner;
  industry: string;
  company: string;
  agency_image: string;
}