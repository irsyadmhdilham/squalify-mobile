import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

import { PointProvider } from "../../../providers/point/point";
import { totalSummary, engagementSummary, salesSummary, contactsSummary, recruitmentSummary, careerSummary } from "../../../models/point";

@Component({
  selector: 'point-detail-summary',
  templateUrl: 'point-detail-summary.html'
})
export class PointDetailSummaryComponent {

  period = 'year';
  total: totalSummary;
  engagement: engagementSummary;
  sales: salesSummary;
  contacts: contactsSummary;
  recruitment: recruitmentSummary;
  career: careerSummary;
  load = false;

  constructor(
    private viewCtrl: ViewController,
    private pointProvider: PointProvider
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.pointProvider.personalSummary(this.period).subscribe(summary => {
      this.total = summary.total;
      this.contacts = summary.contacts;
      this.engagement = summary.engagement;
      this.sales = summary.sales;
      this.recruitment = summary.recruitment;
      this.career = summary.career;
      this.load = true;
    });
  }

  percentageContainerStyle(value: number) {
    if (value > 0) {
      return 'percentage-positive';
    } else if (value === 0) {
      return 'percentage-neutral';
    }
    return 'percentage-negative';
  }

  percentageIconStyle(value: number) {
    if (value > 0) {
      return 'secondaryDark';
    }
    return 'dangerDark';
  }

}
