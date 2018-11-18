import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { contact } from "../../../../interfaces/contact";

@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  pk: number;
  name: string;
  status: string;
  contactType: string;
  contactNo: string;
  remark: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    const contact: contact = this.navParams.get('contact');
    this.pk = contact.pk;
    this.name = contact.name;
    this.status = contact.status;
    this.contactType = contact.contact_type;
    this.contactNo = contact.contact_no;
    this.remark = contact.remark;
  }

}
