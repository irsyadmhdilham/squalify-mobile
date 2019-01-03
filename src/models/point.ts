export interface attribute {
  pk?: number;
  attribute: string;
  point: number;
};

export interface log {
  point_type: string;
  timestamp: string;
  point: number;
  attribute: string
};

export interface point {
  pk?: number;
  attributes: attribute[]
  date: any;
  logs: log[];
  productive_point: number;
  career_point: number;
  total: number;
};

export interface contactPoints {
  pk?: number;
  referrals: {
    pk?: number;
    point: number;
  };
  ftf: {
    pk?: number;
    point: number;
  };
  app_sec: {
    pk?: number;
    point: number;
  };
  calls: {
    pk?: number;
    point: number;
  };
};

export interface groupPoint {
  pk: number;
  name: string;
  designation: string;
  profile_image: string;
  today: number;
  downline?: number;
};

export interface allPoints {
  personal: number;
  group: number | null;
  agency: number;
}

export interface pointIo {
  point: number;
  uplineId: number;
  sender: number;
}