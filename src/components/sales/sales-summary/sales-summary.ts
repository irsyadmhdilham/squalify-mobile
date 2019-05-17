import { Component } from '@angular/core';
import { ViewController, NavParams, ActionSheetController, ModalController } from "ionic-angular";

import { SalesProvider } from "../../../providers/sales/sales";
import { salesStatus } from "../../../models/sales";
import { SalesDateComponent } from "../sales-date/sales-date";

@Component({
  selector: 'sales-summary',
  templateUrl: 'sales-summary.html'
})
export class SalesSummaryComponent {

  salesStatus = {
    submitted: { cases: 0, total: 0 },
    rejected: { cases: 0, total: 0 },
    disburst: { cases: 0, total: 0 },
    in_hand: { cases: 0, total: 0 }
  };
  summary: salesStatus = this.salesStatus;
  screenStatus: string;
  segment: string = this.navParams.get('segment');
  period: string = this.navParams.get('period') === 'all' ? 'Period': this.navParams.get('period');
  dateSelect: { from: Date; until: Date; } = this.navParams.get('dateSelect');
  salesType = 'sales type';
  salesTypeActive = false
  periodActive = false;
  cancel = false;

  constructor(
    private salesProvider: SalesProvider,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'All', handler: () => { this.salesType = 'All'; this.salesTypeActive = true; } },
        { text: 'EPF', handler: () => { this.salesType = 'EPF'; this.salesTypeActive = true; } },
        { text: 'Cash', handler: () => { this.salesType = 'Cash'; this.salesTypeActive = true; } },
        { text: 'ASB', handler: () => { this.salesType = 'ASB'; this.salesTypeActive = true; } },
        { text: 'PRS', handler: () => { this.salesType = 'PRS'; this.salesTypeActive = true; } },
        { text: 'Cancel', role: 'cancel', handler: () => {
          this.cancel = true;
          setTimeout(() => {
            this.cancel = false;
          }, 2000);
        }}
      ]
    });
    actionSheet.present();
    actionSheet.onDidDismiss(() => {
      if (!this.cancel) {
        if (this.segment === 'personal') {
          this.fetch();
        } else {
          this.fetchGroup();
        }
      }
    });
  }

  periodChange() {
    const action = this.actionSheetCtrl.create({
      title: 'Select options below',
      buttons: [
        { text: 'All', handler: () => {
          this.period = 'All';
          this.periodActive = true;
          this.dateSelect = undefined;
          if (this.segment === 'personal') {
            this.fetch();
          } else {
            this.fetchGroup();
          }
        }},
        { text: 'Select date', handler: () => {
          const pickDate = this.modalCtrl.create(SalesDateComponent, { dateSelect: this.dateSelect });
          pickDate.present();
          pickDate.onDidDismiss((data: { from: Date; until: Date }) => {
            if (data) {
              this.dateSelect = data;
              this.period = 'select date';
              this.periodActive = true;
              if (this.segment === 'personal') {
                this.fetch();
              } else {
                this.fetchGroup();
              }
            }
          });
        }}
      ]
    });
    action.present();
  }

  fetch() {
    this.screenStatus = 'loading';
    const period = () => {
      if (this.period === 'Period' || this.period === 'All') {
        return 'all';
      }
      return this.period.toLowerCase();
    };
    this.salesProvider.getPersonalSummary(this.salesType, period(), this.dateSelect).subscribe(summary => {
      this.screenStatus = undefined;
      this.summary = summary;
    }, () => {
      this.screenStatus = 'error';
    });
  }

  fetchGroup() {
    this.screenStatus = 'loading';
    const period = () => {
      if (this.period === 'Period' || this.period === 'All') {
        return 'all';
      }
      return this.period.toLowerCase();
    };
    this.salesProvider.getGroupSummary(this.salesType, period(), this.dateSelect).subscribe(summary => {
      this.screenStatus = undefined;
      this.summary = summary;
    }, () => {
      this.screenStatus = 'error';
    });
  }

  ionViewDidLoad() {
    if (this.segment === 'personal') {
      this.fetch();
    } else {
      this.fetchGroup();
    }
  }

}
