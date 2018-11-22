import { profileComponents } from "./profile/profile-components";
import { InboxComposeComponent } from "./inbox-compose/inbox-compose";
import { NoConnectionComponent } from "./no-connection/no-connection";

import { ContactComponents } from "./contact/contact-components";
import { ScheduleComponents } from "./schedule/schedule-components";
import { PointComponents } from "./point/point-components";

export const Components = [
  profileComponents,
  InboxComposeComponent,
  NoConnectionComponent,
  ...ScheduleComponents,
  ...ContactComponents,
  ...PointComponents
];