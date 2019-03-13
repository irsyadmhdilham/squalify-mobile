import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController, Segment } from 'ionic-angular';
import * as moment from "moment";

import { SalesProvider } from "../../../providers/sales/sales";
import { agency } from "../../../models/agency";
import { sales, groupSales } from "../../../models/sales";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";
import { SalesDetailComponent } from "../../../components/sales/sales-detail/sales-detail";
import { SalesSummaryComponent } from "../../../components/sales/sales-summary/sales-summary";
import { SalesDownlinesPage } from "./sales-downlines/sales-downlines";

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {

  segment = 'personal';
  period = 'period';
  periodActive = false;
  salesType = 'sales type';
  salesStatus = 'status';
  salesTypeActive = false;
  salesStatusActive = false;
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

  timestamp(timestamp: Date) {
    const fromNow = moment(timestamp).fromNow();
    const output = fromNow.match(/(seconds|minute|minutes|hour|hours)/);
    if (output) {
      return fromNow;
    }
    return moment(timestamp).format('D MMM YYYY, h:mma');
  }

  clientName(sales: sales) {
    const clientName = sales.client_name,
          contact = sales.contact;
    if (clientName) {
      return clientName;
    } else if (contact) {
      return contact.name;
    } else {
      return 'No client name';
    }
  }

  selectPeriod() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'All', handler: () => { this.period = 'all'; this.periodActive = true; }},
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
      if (!this.cancel) {
        if (this.segment === 'personal') {
          this.fetchPersonalSales();
        } else {
          this.filterGroupSales();
        }
      }
    });
  }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'Total', handler: () => { this.salesType = 'total'; this.salesTypeActive = true; } },
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
          this.fetchPersonalSales();
        } else {
          this.filterGroupSales();
        }
      }
    });
  }

  selectSalesStatus() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'All', handler: () => { this.salesStatus = 'all'; this.salesStatusActive = true; } },
        { text: 'In hand', handler: () => { this.salesStatus = 'In hand'; this.salesStatusActive = true; } },
        { text: 'Submitted', handler: () => { this.salesStatus = 'Submitted'; this.salesStatusActive = true; } },
        { text: 'Rejected', handler: () => { this.salesStatus = 'Rejected'; this.salesStatusActive = true; } },
        { text: 'Disburst/approved', handler: () => { this.salesStatus = 'Disburst'; this.salesStatusActive = true; } },
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
          this.fetchPersonalSales();
        } else {
          this.filterGroupSales();
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

  segmentChanged(event: Segment) {
    const value = event.value;
    this.period = 'period';
    this.salesType = 'sales type';
    if (value === 'personal') {
      this.fetchPersonalSales();
    } else {
      this.fetchGroupSales();
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

  fetchPersonalSales() {
    this.pageStatus = 'loading';
    const period = this.period,
          salesType = this.salesType,
          salesStatus = this.salesStatus;
    this.salesProvider.getSales(period, salesType, salesStatus).subscribe(sales => {
      this.pageStatus = undefined;
      this.personalSales = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchGroupSales() {
    this.pageStatus = 'loading';
    this.salesProvider.getGroupSales().subscribe(sales => {
      this.pageStatus = undefined;
      this.groupSales = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  filterGroupSales() {
    this.pageStatus = 'loading';
    const period = this.period,
          salesType = this.salesType,
          salesStatus = this.salesStatus;
    this.salesProvider.groupSalesFilter(period, salesType, salesStatus).subscribe(sales => {
      this.pageStatus = undefined;
      this.groupSales = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetchPersonalSales();
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

  navDownline(member: groupSales) {
    if (member.downlines && member.downlines > 0) {
      this.navCtrl.push(SalesDownlinesPage, { member });
    }
  }

}
