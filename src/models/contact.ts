import { schedule } from "./schedule";

export interface contact {
  pk?: number;
  name: string;
  status?: string;
  contact_type: string;
  contact_no: string;
  remark?: string;
  scheduleId?: number;
  schedules?: schedule[];
  referrerId?: number;
  email?: string;
};

export interface logs {
  pk?: number;
  date: Date;
  name: string;
  answered: boolean;
};