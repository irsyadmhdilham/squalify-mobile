export interface sales {
  pk?: number;
  timestamp?: Date;
  amount: number;
  sales_type: string;
  sales_status?: string;
  location?: string;
  commission?: number;
  contact?: {
    pk: number;
    name: string;
  }
  client_name?: string;
  tips?: string;
};

interface summaryOutput {
  cases: number;
  total: number;
}

export interface salesStatus {
  in_hand: summaryOutput;
  submitted: summaryOutput;
  rejected: summaryOutput;
  disburst: summaryOutput;
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