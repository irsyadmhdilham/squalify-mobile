import { Component, ViewChild, Input } from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  LoadingController,
  Events,
  AlertController,
  Platform
} from 'ionic-angular';
import { Subject } from "rxjs";
import { Subscription } from "rxjs/Subscription";
import { take } from "rxjs/operators";
import * as Chart from "chart.js";
import { Store, select } from "@ngrx/store";
import { store } from "../../models/store";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Storage } from "@ionic/storage";

import { PointProvider } from "../../providers/point/point";
import { AuthProvider } from "../../providers/auth/auth";
import {
  totalSummary,
  engagementSummary,
  salesSummary,
  contactsSummary,
  recruitmentSummary,
  careerSummary,
  consultantPerfRange
} from "../../models/point";
import { ContactType as contactColor } from "../../functions/colors";
import { Ids } from "../../functions/config";
import { SocketioReset } from "../../store/actions/socketio.action";

@Component({
  selector: 'page-agencies-summary',
  templateUrl: 'agencies-summary.html',
})
export class AgenciesSummaryPage extends Ids {

  @ViewChild('contactCanvas') contactCanvas: any;
  @ViewChild('consultantPerfCanvas') consultantPerfCanvas: any;
  @Input() signedIn: string;
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
  contentStyle = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pointProvider: PointProvider,
    private authProvider: AuthProvider,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private alertCtrl: AlertController,
    private store: Store<store>,
    private platform: Platform,
    private localNotifications: LocalNotifications,
    public storage: Storage
  ) {
    super(storage);
  }

  clearLocalNotif() {
    this.platform.ready().then(() => {
      const isCordova = this.platform.is('cordova');
      if (isCordova) {
        this.localNotifications.clearAll();
      }
    });
  }

  _signOut() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.authProvider.signOut().subscribe(() => {
      this.clearLocalNotif();
      this.removeAllCredentials().then(value => {
        if (value) {
          loading.dismiss();
          this.store.pipe(select('io'), take(1)).subscribe((io: any) => {
            io.close();
            this.store.dispatch(new SocketioReset());
          });
          this.events.publish('sign out', 'not sign in');
        }
      });
    });
  }

  signOut() {
    const alert = this.alertCtrl.create({
      title: 'Are you sure',
      subTitle: 'Are you sure to sign out?',
      buttons: [
        { text: 'Cancel' },
        { text: 'Sign out', cssClass: 'danger-alert', handler: this._signOut.bind(this) }
      ]
    });
    alert.present();
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.agenciesSummary(this.period).subscribe(summary => {
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

  contentSetan() {
    if (this.contentStyle) {
      return { marginTop: '2em' }
    }
    return false;
  }

  ngOnInit() {
    this.fetch();
    this.events.subscribe('this is hq', () => {
      this.contentStyle = true;
    });
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
