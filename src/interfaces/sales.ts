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