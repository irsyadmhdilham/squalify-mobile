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
}

interface salesInstance {
  sales: string,
  income: string
}

export interface year {
  EPF?: salesInstance;
  Cash?: salesInstance;
  ASB?: salesInstance;
  PRS?: salesInstance;
  Total: salesInstance;
}

export interface month {
  EPF?: salesInstance;
  Cash?: salesInstance;
  ASB?: salesInstance;
  PRS?: salesInstance;
  Total: salesInstance;
}
export interface week {
  EPF?: salesInstance;
  Cash?: salesInstance;
  ASB?: salesInstance;
  PRS?: salesInstance;
  Total: salesInstance;
}
export interface today {
  EPF?: salesInstance;
  Cash?: salesInstance;
  ASB?: salesInstance;
  PRS?: salesInstance;
  Total: salesInstance;
}

export interface summary {
  year: year;
  month: month;
  today: today;
}