import { Component } from '@angular/core';

import { Point } from "./point";

@Component({
  selector: 'point-panel',
  templateUrl: 'point-panel.html'
})
export class PointPanelComponent {

  productivePoints = [
    new Point(0, 'ftf.png', 'FTF/Nesting/ Booth', 2),
    new Point(0, 'field-work.png', 'Joining field work', 1),
    new Point(0, 'referral.png', 'Referrals', 1),
    new Point(0, 'call.png', 'Calls/Email/ Socmed', 1),
    new Point(0, 'appointment.png', 'Appointment secured', 2),
    new Point(0, 'sales-presentation.png', 'Sales presentations', 3),
    new Point(0, 'career-presentation.png', 'Career presentation', 3),
    new Point(0, 'case-closed.png', 'Case closed', 4),
    new Point(0, 'sign-contract.png', 'Sign up contract', 3)
  ];
  careerPoints = [
    new Point(0, 'suit.png', 'Millionnaire suit', 3),
    new Point(0, 'update.png', 'Update upline', 2),
    new Point(0, 'servicing.png', 'Servicing/ Follow up', 1),
    new Point(0, 'coaching.png', 'Personal coaching', 1),
    new Point(0, 'early.png', 'Be early training', 3),
    new Point(0, 'agency-program.png', 'Agency program', 5)
  ];

  constructor() { }

}
