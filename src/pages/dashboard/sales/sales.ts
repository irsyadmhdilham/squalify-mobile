import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { agency } from "../../../interfaces/agency";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";

@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {

  segment = 'personal';
  agency: agency;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  addSales() {
    const modal = this.modalCtrl.create(AddSalesComponent);
    modal.present();
  }

  ionViewDidLoad() {
    this.addSales();
  }

}
