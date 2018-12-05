import { ContactProvider } from "./contact/contact";
import { ProfileProvider } from "./profile/profile";
import { ScheduleProvider } from "./schedule/schedule";
import { PointProvider } from "./point/point";
import { SalesProvider } from "./sales/sales";
import { PostProvider } from "./post/post";
import { AuthProvider } from './auth/auth';
import { AgencyProvider } from "./agency/agency";
import { GroupProvider } from "./group/group";

export const Providers = [
  ContactProvider,
  ProfileProvider,
  ScheduleProvider,
  PointProvider,
  SalesProvider,
  PostProvider,
  AuthProvider,
  AgencyProvider,
  GroupProvider
];