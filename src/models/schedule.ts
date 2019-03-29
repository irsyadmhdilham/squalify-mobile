import { contact } from "./contact";

export interface schedule {
  pk?: number;
  date: any;
  title: string;
  remark?: string;
  location: string;
  reminder?: any;
  contact?: contact;
  created_by?: {
    pk: number;
    name: string;
  }
};

export interface filterData {
  title: string;
  location: string;
  remark: string;
  date: { from: string; until: string; };
}