export interface sales {
  pk?: number;
  timestamp?: any;
  amount: any;
  sales_type: string;
  repeat_sales?: boolean;
  surcharge?: number;
  sales_status?: string;
  document_id?: string;
  location?: string;
  commission?: number;
};

interface instance {
  sales: string,
  income: string
};

export interface summary {
  year: instance;
  month: instance;
  week: instance;
  today: instance;
};

export interface groupSales {
  pk: number;
  name: string;
  profile_image: string;
  designation: string;
  amount: string;
  downline?: number;
};

export interface downlineSales {
  pk: number;
  name: string;
  profile_image: string;
  designation: string;
  amount: string;
  downlines: groupSales[];
};

export interface salesIo {
  sender: number;
  amount: number;
}