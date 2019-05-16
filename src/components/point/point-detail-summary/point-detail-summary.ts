import { Component, ViewChild } from '@angular/core';
import { ViewController, ActionSheetController, NavParams, ModalController } from "ionic-angular";
import { Chart } from "chart.js";
import { Subject } from "rxjs";
import { Subscription } from "rxjs/Subscription";
import * as moment from "moment";

import { PointProvider } from "../../../providers/point/point";
import {
  totalSummary,
  engagementSummary,
  salesSummary,
  contactsSummary,
  recruitmentSummary,
  careerSummary,
  consultantPerfRange
} from "../../../models/point";
import { ContactType as contactColor } from "../../../functions/colors";
import { SalesDateComponent } from "../../sales/sales-date/sales-date";

@Component({
  selector: 'point-detail-summary',
  templateUrl: 'point-detail-summary.html'
})
export class PointDetailSummaryComponent {

  @ViewChild('contactCanvas') contactCanvas: any;
  @ViewChild('consultantPerfCanvas') consultantPerfCanvas: any;
  section: string = this.navParams.get('segment');
  period = 'year';
  total: totalSummary;
  engagement: engagementSummary;
  sales: salesSummary;
  contacts: contactsSummary;
  recruitment: recruitmentSummary;
  career: careerSummary;
  consultantPerfRange: consultantPerfRange;
  pageStatus: string;
  load = false;
  colors = contactColor;
  loadData = new Subject<boolean>();
  loadDataSubscription: Subscription;
  dateSelect: { from: Date; until: Date };

  constructor(
    private viewCtrl: ViewController,
    private pointProvider: PointProvider,
    private actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    const fetch = () => {
      let dateSelect;
      if (this.period === 'select date') {
        dateSelect = {
          from: moment(this.dateSelect.from).toISOString(),
          until: moment(this.dateSelect.until).toISOString()
        };
      }
      if (this.section === 'personal') {
        return this.pointProvider.personalSummary(this.period, dateSelect);
      } else {
        return this.pointProvider.groupSummary(this.period, dateSelect);
      }
    };
    this.pageStatus = 'loading';
    fetch().subscribe(summary => {
      this.total = summary.total;
      this.contacts = summary.contacts;
      this.engagement = summary.engagement;
      this.sales = summary.sales;
      this.recruitment = summary.recruitment;
      this.career = summary.career;
      this.consultantPerfRange = summary.consultant_perf_range;
      this.pageStatus = undefined;
      this.load = true;
      this.loadData.next(true);
    });
  }

  contactBullet(type: string) {
    switch (type) {
      case 'Referrals':
        return {
          background: this.colors.referrals
        };
      case 'Booth':
        return {
          background: this.colors.booth
        };
      case 'Face to face':
        return {
          background: this.colors.ftf
        };
      case 'Social media':
        return {
          background: this.colors.socmed
        };
      case 'Nesting':
        return {
          background: this.colors.nesting
        };
      case 'Other':
        return {
          background: this.colors.other
        };
      case 'Table to table/Door to door':
        return {
          background: this.colors.ttt
        };
      case 'Client':
        return {
          background: this.colors.client
        };
    }
  }

  showContactChart() {
    const contacts = Object.keys(this.contacts.contacts).map(value => this.contacts.contacts[value]);
    const total = contacts.reduce((a, b) => a + b);
    if (total === 0) {
      return false;
    }
    return true;
  }

  showConsultantPerfChart() {
    const consultants = Object.keys(this.consultantPerfRange).map(value => this.consultantPerfRange[value]);
    const total = consultants.reduce((a, b) => a + b);
    if (total === 0) {
      return false;
    }
    return true;
  }

  contactsChart() {
    const contacts = this.contacts.contacts,
          colors = this.colors;
    if (this.showContactChart()) {
      new Chart(this.contactCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Referrals', 'Booth', 'Face to face', 'Social media', 'Nesting', 'Other', 'Table to table/Door to door', 'Client'],
          datasets: [{
            label: 'Contacts list',
            data: [
              contacts.referrals, contacts.booth, contacts.ftf, contacts.socmed, contacts.nesting, contacts.other, contacts.ttt, contacts.client
            ],
            backgroundColor: [
              colors.referrals, colors.booth, colors.ftf, colors.socmed, colors.nesting, colors.other, colors.ttt, colors.client
            ]
          }]
        },
        options: {
          legend: {
            display: false
          }
        }
      });
    }
  }

  // consultantPerfChart() {
  //   if (this.section === 'group' && this.showConsultantPerfChart()) {
  //     new Chart(this.consultantPerfCanvas.nativeElement, {
  //       type: 'bar',
  //       data: {
  //         labels: ['0-20', '21-40', '41-60', '61-80', '80-100', '100+'],
  //         datasets: [{
  //           data: [
  //             this.consultantPerfRange._0_20,
  //             this.consultantPerfRange._21_40,
  //             this.consultantPerfRange._41_60,
  //             this.consultantPerfRange._61_80,
  //             this.consultantPerfRange._81_100,
  //             this.consultantPerfRange._100
  //           ],
  //           backgroundColor: [
  //             Colors.primary,
  //             Colors.primary,
  //             Colors.primary,
  //             Colors.primary,
  //             Colors.primary,
  //             Colors.primary
  //           ]
  //         }]
  //       },
  //       options: {
  //         legend: {
  //           display: false
  //         },
  //         scales: {
  //           yAxes: [{
  //             ticks: {
  //               beginAtZero: true
  //             },
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Num of consultants'
  //             }
  //           }],
  //           xAxes: [{
  //             scaleLabel: {
  //               display: true,
  //               labelString: `Points/${this.period}`
  //             },
  //             barPercentage: 0.6
  //           }]
  //         }
  //       }
  //     });
  //   }
  // }

  ionViewDidLoad() {
    this.fetch();
    this.loadDataSubscription = this.loadData.subscribe(() => {
      setTimeout(() => {
        this.contactsChart();
        // this.consultantPerfChart();
      }, 300);
    });
  }

  ionViewDidLeave() {
    this.loadDataSubscription.unsubscribe();
  }

  numberPercentage(value: number) {
    if (value < 0) {
      return 0;
    }
    return value;
  }

  percentage(value: number) {
    if (value < 0) {
      return Math.abs(value);
    }
    return value;
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

  changePeriod() {
    const action = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'Year', handler: () => {
          if (this.period !== 'year') {
            this.period = 'year';
            this.fetch();
          }
        }},
        { text: 'Select date', handler: () => {
          const pickDate = this.modalCtrl.create(SalesDateComponent, { dateSelect: this.dateSelect });
          pickDate.present();
          pickDate.onDidDismiss((data: { from: Date; until: Date }) => {
            if (data) {
              this.period = 'select date';
              this.dateSelect = data;
              this.fetch();
            }
          });
        }}
        // { text: 'Month', handler: () => {
        //   if (this.period !== 'month') {
        //     this.period = 'month';
        //     this.fetch();
        //   }
        // }},
        // { text: 'Week', handler: () => {
        //   if (this.period !== 'week') {
        //     this.period = 'week';
        //     this.fetch();
        //   }
        // }},
        // { text: 'Today', handler: () => {
        //   if (this.period !== 'today') {
        //     this.period = 'today';
        //     this.fetch();
        //   }
        // }}
      ]
    });
    action.present();
  }

}
