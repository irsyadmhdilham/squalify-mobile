import { Component } from '@angular/core';
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  LoadingController,
  ModalController,
  ActionSheetController,
  NavParams
} from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";
import { SalesProvider } from "../../../providers/sales/sales";

import { contact } from "../../../models/contact";
import { sales } from "../../../models/sales";
import { ContactListComponent } from "../../contact/contact-list/contact-list";

@Component({
  selector: 'edit-sales',
  templateUrl: 'edit-sales.html'
})
export class EditSalesComponent {

  screenStatus: string;
  company: string;
  amount: string;
  salesType: string;
  location: string;
  status: string;
  contact: string;
  contactId: number;
  clientMethod: string;

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider,
    private salesProvider: SalesProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  salesTypes() {
    if (this.company === 'CWA') {
      return ['EPF', 'Cash', 'ASB', 'PRS', 'Wasiat', 'Takaful'];
    } else if (this.company === 'Public Mutual') {
      return ['EPF', 'Cash'];
    }
  }

  surcharges() {
    if (this.company === 'CWA') {
      return [5, 6.5];
    }
    return false;
  }

  getCompany() {
    this.screenStatus = 'loading';
    this.agencyProvider.getAgencyDetail('company').subscribe(observe => {
      this.screenStatus = undefined;
      this.company = observe.company;
    }, () => {
      this.screenStatus = undefined;
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: 'Failed to receive data',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    this.getCompany();
    const sales: sales = this.navParams.get('sales');
    this.amount = sales.amount.toString();
    this.location = sales.location;
    this.salesType = sales.sales_type;
    this.status = sales.sales_status;
    if (sales.contact) {
      this.contact = sales.contact.name;
      this.contactId = sales.contact.pk;
      this.clientMethod = 'contact';
    } else if (sales.client_name) {
      this.contact = sales.client_name;
      this.clientMethod = 'write';
    }
  }

  clientMethodHandler() {
    const action = this.actionSheetCtrl.create({
      title: 'Select method',
      buttons: [
        { text: 'Select from contact', handler: () => {this.clientMethod = 'contact'}},
        { text: 'Write client name', handler: () => {{this.clientMethod = 'write'}} },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    action.present();
  }

  pickContact() {
    const modal = this.modalCtrl.create(ContactListComponent, { sales: true });
    modal.present();
    modal.onDidDismiss((data: contact) => {
      if (data) {
        this.contact = data.name;
        this.contactId = data.pk;
      }
    })
  }

  async addSales() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (this.amount === '') {
        throw 'Please insert sales amount';
      }
      if (this.salesType === '') {
        throw 'Please select sales type';
      }
      if (!this.contact || this.contact === '') {
        throw 'Please insert client name';
      }
      let data: any  = {
        amount: parseFloat(this.amount),
        sales_type: this.salesType,
        sales_status: this.status
      };
      if (this.clientMethod === 'contact') {
        data.contact = this.contactId;
      } else if (this.clientMethod === 'write') {
        data.client_name = this.contact;
      }
      if (this.location !== '') {
        data.location = this.location;
      }
      loading.present();
      this.salesProvider.createSales(data).subscribe(sales => {
        loading.dismiss();
        this.salesProvider.addSalesEmit(sales.amount);
        this.viewCtrl.dismiss({ sales });
      }, () => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: 'Failed to add sales, please try again later',
          buttons: ['Ok']
        });
        alert.present();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Required field empty',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
