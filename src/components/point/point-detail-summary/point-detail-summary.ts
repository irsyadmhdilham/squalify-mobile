import { Component, ViewChild } from '@angular/core';
import { ViewController, ActionSheetController, NavParams } from "ionic-angular";
import { Chart } from "chart.js";
import { Subject } from "rxjs";
import { first } from "rxjs/operators";

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
import { ContactType as contactColor, Colors } from "../../../functions/colors";

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
  fireChart = new Subject<boolean>();
  colors = contactColor;

  constructor(
    private viewCtrl: ViewController,
    private pointProvider: PointProvider,
    private actionSheetCtrl: ActionSheetController,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    const fetch = () => {
      if (this.section === 'personal') {
        return this.pointProvider.personalSummary(this.period);
      } else {
        return this.pointProvider.groupSummary(this.period);
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

  contactsChart() {
    const contacts = this.contacts.contacts,
          colors = this.colors;
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

  consultantPerfChart() {
    if (this.section === 'group') {
      new Chart(this.consultantPerfCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['0-20', '21-40', '41-60', '61-80', '80-100', '100+'],
          datasets: [{
            data: [
              this.consultantPerfRange._0_20,
              this.consultantPerfRange._21_40,
              this.consultantPerfRange._41_60,
              this.consultantPerfRange._61_80,
              this.consultantPerfRange._81_100,
              this.consultantPerfRange._100
            ],
            backgroundColor: [
              Colors.primary,
              Colors.primary,
              Colors.primary,
              Colors.primary,
              Colors.primary,
              Colors.primary
            ]
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Num of consultants'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: `Points/${this.period}`
              },
              barPercentage: 0.6
            }]
          }
        }
      });
    }
  }

ngDoCheck() {
  if (this.load) {
    setTimeout(() => {
      this.fireChart.next(true);
    }, 300);
  }
}

  ionViewDidLoad() {
    this.fetch();
    this.fireChart.pipe(first()).subscribe(value => {
      if (value) {
        this.contactsChart();
        this.consultantPerfChart();
      }
    });
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
        { text: 'Month', handler: () => {
          if (this.period !== 'month') {
            this.period = 'month';
            this.fetch();
          }
        }},
        { text: 'Week', handler: () => {
          if (this.period !== 'week') {
            this.period = 'week';
            this.fetch();
          }
        }},
        { text: 'Today', handler: () => {
          if (this.period !== 'today') {
            this.period = 'today';
            this.fetch();
          }
        }}
      ]
    });
    action.present();
  }

}
