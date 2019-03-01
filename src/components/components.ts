import { profileComponents } from "./profile/profile-components";
import { inboxComponents } from "./inbox/inbox-components";
import { NoConnectionComponent } from "./no-connection/no-connection";

import { ContactComponents } from "./contact/contact-components";
import { ScheduleComponents } from "./schedule/schedule-components";
import { PointComponents } from "./point/point-components";
import { SalesComponents } from "./sales/sales-components";
import { HomeComponents } from "./home/home-components";
import { EditAgencyComponent } from "./edit-agency/edit-agency";
import { ComposeMemoComponent } from "./compose-memo/compose-memo";

export const Components = [
  profileComponents,
  NoConnectionComponent,
  ...inboxComponents,
  ...ScheduleComponents,
  ...ContactComponents,
  ...PointComponents,
  ...SalesComponents,
  ...HomeComponents,
  EditAgencyComponent,
  ComposeMemoComponent
];