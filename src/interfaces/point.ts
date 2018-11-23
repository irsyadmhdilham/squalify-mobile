export interface attribute {
  pk?: number;
  attribute: string;
  point: number;
}

export interface point {
  pk?: number;
  attributes: attribute[]
  date: any;
  logs: any;
}