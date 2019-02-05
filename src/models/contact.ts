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
};

export interface logs {
  date: Date;
  name: string;
  answered: boolean;
};