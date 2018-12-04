import { Component, Input, OnChanges } from '@angular/core';
import { ModalController, AlertController } from "ionic-angular";

import { PointLogsComponent } from "../point-logs/point-logs";
import { Colors } from "../../../functions/colors";

@Component({
  selector: 'point-panel',
  templateUrl: 'point-panel.html'
})
export class PointPanelComponent implements OnChanges {

  @Input() todayPoint;
  @Input() dontShowToast;
  pointPk: number;
  productiveTopLine = {
    borderTop: `solid 0.55px ${Colors.lightGrey}`,
    marginTop: '1em'
  };
  productiveBottomLine = {
    borderBottom: `solid 0.55px ${Colors.lightGrey}`,
    paddingBottom: '1em'
  };
  editMode: boolean;
  productivePoints = [
      { img: 'ftf.png', attribute: 'FTF/Nesting/Booth', each: 2 },
      { img: 'field-work.png', attribute: 'Joining field work', each: 1 },
      { img: 'referral.png', attribute: 'Referrals', each: 1 },
      { img: 'call.png', attribute: 'Calls/Email/Socmed', each: 1 },
      { img: 'appointment.png', attribute: 'Appointment secured', each: 2 },
      { img: 'sales-presentation.png', attribute: 'Sales presentation', each: 3 },
      { img: 'career-presentation.png', attribute: 'Career presentation', each: 3 },
      { img: 'case-closed.png', attribute: 'Case closed', each: 4 },
      { img: 'sign-contract.png', attribute: 'Sign up contract', each: 3 }
    ];
  careerPoints = [
      { img: 'suit.png', attribute: 'Millionnaire suit', each: 3 },
      { img: 'update.png', attribute: 'Update upline', each: 2 },
      { img: 'servicing.png', attribute: 'Servicing/Follow up', each: 1 },
      { img: 'coaching.png', attribute: 'Personal coaching', each: 1 },
      { img: 'early.png', attribute: 'Be early training', each: 3 },
      { img: 'agency-program.png', attribute: 'Agency program', each: 5 }
    ];
    totalPoints = 0;
    totalProductivePoints = 0;
    totalCareerPoints = 0;
  
  constructor(private modalCtrl: ModalController, public alertCtrl: AlertController) { }

  edit() {
    if (!this.editMode) {
      this.editMode = true;
      return;
    }
    this.editMode = false;
  }

  showLog() {
    if (this.todayPoint) {
      const modal = this.modalCtrl.create(PointLogsComponent, {
        pk: this.todayPoint.pk
      });
      modal.present();
    }
  }

  ngOnChanges() {
    if (this.todayPoint) {
      const total = this.todayPoint.attributes.map(val => val.point).reduce((a, b) => a + b);
      this.totalPoints = total;

      //total productive points
      const productivePoints = this.todayPoint.attributes.filter(val => {
        const points = this.productivePoints.map(val => val.attribute);
        const matching = points.filter(attr => attr === val.attribute);
        if (matching.length > 0) {
          return true;
        }
        return false;
      });
      if (productivePoints.length > 0) {
        const totalProductivePoints = productivePoints.map(val => val.point).reduce((a, b) => a + b);
        this.totalProductivePoints = totalProductivePoints;
      }

      //total career points
      const careerPoints = this.todayPoint.attributes.filter(val => {
        const points = this.careerPoints.map(val => val.attribute);
        const matching = points.filter(attr => attr === val.attribute);
        if (matching.length > 0) {
          return true;
        }
        return false;
      });
      if (careerPoints.length > 0) {
        const totalCareerPoints = careerPoints.map(val => val.point).reduce((a, b) => a + b);
        this.totalCareerPoints = totalCareerPoints;
      }
    }
  }

  updatePoint(value) {
    if (value.type === 'add') {
      this.totalPoints += value.point;
      if (value.pointType === 'career') {
        this.totalCareerPoints += value.point;
      } else {
        this.totalProductivePoints += value.point;
      }
    } else {
      this.totalPoints -= value.point;
      if (value.pointType === 'career') {
        this.totalCareerPoints -= value.point;
      } else {
        this.totalProductivePoints -= value.point;
      }
    }
  }

  getPointPk(value) {
    this.pointPk = value;
  }

}
