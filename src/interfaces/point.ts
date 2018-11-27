export interface attribute {
  pk?: number;
  attribute: string;
  point: number;
}

export interface log {
  type: string;
  time: string;
  point: number;
  attribute: string
}

export interface point {
  pk?: number;
  attributes: attribute[]
  date: any;
  logs: {
    logs: log[]
  };
}

export interface allPoints {
  agency: number;
  personal: number;
  group: number;
}