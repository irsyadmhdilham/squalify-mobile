import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from "ionic-angular";

import { PointProvider } from "../../../providers/point/point";
import { PointLogComponent } from "../point-log/point-log";

import { Point } from "./point";
import { Colors } from "../../../functions/colors";

@Component({
  selector: 'point-panel',
  templateUrl: 'point-panel.html'
})
export class PointPanelComponent {

  @Input() point;
  productiveTopLine = {
    borderTop: `solid 0.55px ${Colors.lightGrey}`,
    marginTop: '1em'
  };
  productiveBottomLine = {
    borderBottom: `solid 0.55px ${Colors.lightGrey}`,
    paddingBottom: '1em'
  };
  editMode: boolean;

  constructor(private modalCtrl: ModalController, private pointProvider: PointProvider, public alertCtrl: AlertController) { }

  productivePoints() {
    return [
      new Point(this.point, 'ftf.png', 'FTF/Nesting/Booth', 2, this.pointProvider),
      new Point(this.point, 'field-work.png', 'Joining field work', 1, this.pointProvider),
      new Point(this.point, 'referral.png', 'Referrals', 1, this.pointProvider),
      new Point(this.point, 'call.png', 'Calls/Email/Socmed', 1, this.pointProvider),
      new Point(this.point, 'appointment.png', 'Appointment secured', 2, this.pointProvider),
      new Point(this.point, 'sales-presentation.png', 'Sales presentation', 3, this.pointProvider),
      new Point(this.point, 'career-presentation.png', 'Career presentation', 3, this.pointProvider),
      new Point(this.point, 'case-closed.png', 'Case closed', 4, this.pointProvider),
      new Point(this.point, 'sign-contract.png', 'Sign up contract', 3, this.pointProvider)
    ];
  }

  careerPoints() {
    return [
      new Point(this.point, 'suit.png', 'Millionnaire suit', 3, this.pointProvider),
      new Point(this.point, 'update.png', 'Update upline', 2, this.pointProvider),
      new Point(this.point, 'servicing.png', 'Servicing/Follow up', 1, this.pointProvider),
      new Point(this.point, 'coaching.png', 'Personal coaching', 1, this.pointProvider),
      new Point(this.point, 'early.png', 'Be early training', 3, this.pointProvider),
      new Point(this.point, 'agency-program.png', 'Agency program', 5, this.pointProvider)
    ];
  }

  edit() {
    if (!this.editMode) {
      this.editMode = true;
      return;
    }
    this.editMode = false;
  }

  showLog() {
    const modal = this.modalCtrl.create(PointLogComponent);
    modal.present();
  }

}
