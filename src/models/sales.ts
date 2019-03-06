export interface sales {
  pk?: number;
  timestamp?: Date;
  amount: number;
  sales_type: string;
  sales_status?: string;
  location?: string;
  commission?: number;
};

export interface salesStatus {
  in_hand: number;
  submitted: number;
  rejected: number;
  disburst: number;
};

export interface summary {
  year: salesStatus;
  month: salesStatus;
  week: salesStatus;
  today: salesStatus;
};

export interface groupSales {
  pk: number;
  name: string;
  profile_image: string;
  group: number;
  personal: number;
  downlines?: number;
};

export interface salesIo {
  sender: number;
  amount: number;
}