import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { SalesProvider } from "../../../providers/sales/sales";
import { agency } from "../../../interfaces/agency";
import { sales } from "../../../interfaces/sales";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";
import { SalesDetailComponent } from "../../../components/sales/sales-detail/sales-detail";
import { SalesSummaryComponent } from "../../../components/sales/sales-summary/sales-summary";
import { SalesDownlinesPage } from "./sales-downlines/sales-downlines";

@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {

  segment = 'personal';
  period = 'period';
  periodActive = false;
  salesType = 'sales type';
  salesTypeActive = false;
  agency: agency;
  pageStatus: string;
  personalSales: sales[] = [];
  cancel = false;
  groupSales = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private salesProvider: SalesProvider,
    private actionSheetCtrl: ActionSheetController
  ) { }

  selectPeriod() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'Year', handler: () => { this.period = 'year'; this.periodActive = true; }},
        { text: 'Month', handler: () => { this.period = 'month'; this.periodActive = true; }},
        { text: 'Week', handler: () => { this.period = 'week'; this.periodActive = true; }},
        { text: 'Today', handler: () => { this.period = 'today'; this.periodActive = true; }},
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
      let period = this.period,
          salesType = this.salesType;
      if (period === 'period') {
        period = 'year';
      }
      if (salesType === 'sales type') {
        period = 'total';
      }
      if (!this.cancel) {
        if (this.segment === 'personal') {
          this.fetchPersonalSales(period, salesType);
        } else {
          this.fetchGroupSales(period, salesType);
        }
      }
    });
  }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'Total', handler: () => { this.salesType = 'total'; this.salesTypeActive = true; } },
        { text: 'EPF', handler: () => { this.salesType = 'epf'; this.salesTypeActive = true; } },
        { text: 'Cash', handler: () => { this.salesType = 'cash'; this.salesTypeActive = true; } },
        { text: 'ASB', handler: () => { this.salesType = 'asb'; this.salesTypeActive = true; } },
        { text: 'PRS', handler: () => { this.salesType = 'prs'; this.salesTypeActive = true; } },
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
      let period = this.period,
          salesType = this.salesType;
      if (period === 'period') {
        period = 'year';
      }
      if (salesType === 'sales type') {
        period = 'total';
      }
      if (!this.cancel) {
        if (this.segment === 'personal') {
          this.fetchPersonalSales(period, salesType);
        } else {
          this.fetchGroupSales(period, salesType);
        }
      }
    });
  }

  showSummaryCondition() {
    if (this.personalSales.length !== 0 && this.segment === 'personal') {
      return true;
    } else if (this.groupSales.length !== 0 && this.segment === 'group') {
      return true;
    }
  }

  showSummary() {
    let salesType = this.salesType;
    const modal = this.modalCtrl.create(SalesSummaryComponent, {
      type: salesType,
      segment: this.segment
    });
    modal.present();
  }

  segmentChanged(event) {
    const value = event.value;
    let period = this.period,
        salesType = this.salesType;
    if (period === 'period') {
      period = 'year';
    }
    if (salesType === 'sales type') {
      salesType = 'total';
    }
    if (value === 'personal') {
      this.fetchPersonalSales(period, salesType);
    } else {
      this.fetchGroupSales(period, salesType);
    }
  }

  addSales() {
    const modal = this.modalCtrl.create(AddSalesComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        const sales = {
          ...data.sales,
          amount: parseFloat(data.sales.amount),
          timestamp: new Date(data.sales.timestamp)
        };
        this.personalSales.unshift(sales);
      }
    });
  }

  fetchPersonalSales(period, salesType) {
    this.pageStatus = 'loading';
    this.salesProvider.getSales(period, salesType).subscribe(observe => {
      this.pageStatus = undefined;
      this.personalSales = observe.map(val => {
        return {
          ...val,
          timestamp: new Date(val.timestamp),
          amount: parseFloat(val.amount)
        };
      });
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchGroupSales(period, salesType) {
    this.pageStatus = 'loading';
    this.salesProvider.getGroupSales(period, salesType).subscribe(observe => {
      this.pageStatus = undefined;
      const sales = observe.map(val => {
        return {
          ...val,
          amount: parseFloat(val.amount)
        };
      });
      this.groupSales = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetchPersonalSales('year', 'total');
  }

  showDetail(sales, index) {
    const modal = this.modalCtrl.create(SalesDetailComponent, { sales, index });
    modal.present();
    modal.onDidDismiss(cb => {
      if (cb) {
        if (cb.removed) {
          this.personalSales.splice(cb.index, 1);
        }
      }
    });
  }

  groupMemberImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') no-repeat center center / cover`
    };
  }

  navDownline(member) {
    if (member.downline && member.downline > 0) {
      this.navCtrl.push(SalesDownlinesPage, { memberId: member.pk });
    }
  }

}
