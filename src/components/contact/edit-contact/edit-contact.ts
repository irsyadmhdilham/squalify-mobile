import { Component, ViewChild } from '@angular/core';
import {
  ViewController,
  Select,
  AlertController,
  LoadingController,
  NavParams,
  ModalController,
  ToastController
} from "ionic-angular";

import { contact } from "../../../interfaces/contact";
import { contactPoints } from "../../../interfaces/point";

import { ContactProvider } from "../../../providers/contact/contact";
import { PointProvider } from "../../../providers/point/point";

import { AddScheduleComponent } from "../../schedule/add-schedule/add-schedule";

@Component({
  selector: 'edit-contact',
  templateUrl: 'edit-contact.html'
})
export class EditContactComponent {

  pk: number;
  name: string;
  previousStatus: string;
  status: string;
  contactType: string;
  previousContactType: string;
  contactNo: string;
  remark: string;
  contactTypeSelectOptions = { title: 'Select contact type' };
  statusSelectOptions = { title: 'Select status' };
  @ViewChild('_contactType') _contactType: Select;
  point: contactPoints;

  constructor(
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private contactProvider: ContactProvider,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private pointProvider: PointProvider,
    private toastCtrl: ToastController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  updatePoint(pk: number, point: number, attr_pk: number) {
    return new Promise(async (resolve, reject) => {
      const data = { pk, point, attribute: 'Appointment secured', attr_pk };
      const toast = this.toastCtrl.create({
        message: `Point added, Total Appointment secured point: ${point}`,
        position: 'top',
        showCloseButton: true
      });
      const loading = this.loadingCtrl.create({content: 'Please wait...'});
      loading.present();
      const userId = await this.pointProvider.userId();
      if (pk) {
        this.pointProvider.updatePoint(userId, pk, true, data).subscribe(() => {
          loading.dismiss();
          toast.present();
          toast.onDidDismiss(() => {
            resolve(true);
          });
        }, (err: Error) => {
          loading.dismiss();
          reject(false);
        });
      } else {
        this.pointProvider.createPoint(userId, true, data).subscribe(() => {
          loading.dismiss();
          toast.present();
          toast.onDidDismiss(() => {
            resolve(true);
          });
        }, (err: Error) => {
          loading.dismiss();
          reject(false);
        });
      }
    });
  }

  updateContact(nameNgModel, statusNgModel, contactTypeNgModel, contactNoNgModel, remarkNgModel) {
    try {
      if (!nameNgModel.valid) {
        throw 'Please insert name';
      }
      if (!statusNgModel.valid) {
        throw 'Please select status';
      }
      if (!contactTypeNgModel.valid) {
        throw 'Please select contact type';
      }
      if (!contactNoNgModel.valid) {
        throw 'Please insert contact no';
      }
      const name = nameNgModel.value,
            status = statusNgModel.value,
            contact_type = contactTypeNgModel.value,
            contact_no = contactNoNgModel.value,
            remark = remarkNgModel.value;
      const data = { name, status, contact_type, contact_no, remark };
      if (statusNgModel.value === 'Appointment secured' && statusNgModel.dirty && this.point) {
        const modal = this.modalCtrl.create(AddScheduleComponent);
        modal.present();
        modal.onDidDismiss(async data => {
          if (data) {
            const point = this.point;
            const pointAdded = await this.updatePoint(point.pk, point.app_sec.point + 2, point.app_sec.pk);
            if (pointAdded) {
              this.updateContactSubmit(data);
            }
          }
        });
      } else {
        this.updateContactSubmit(data);
      }
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  updateContactSubmit(data) {
    const loading = this.loadingCtrl.create({ content: 'Please wait' });
    loading.present();
    this.contactProvider.userId().then(userId => {
      this.contactProvider.updateContact(userId, this.pk, data).subscribe(observe => {
        loading.dismiss();
        this.viewCtrl.dismiss({
          name: observe.name,
          status: observe.status,
          contact_type: observe.contact_type,
          contact_no: observe.contact_no,
          remark: observe.remark,
          edited: true,
          point: this.point
        });
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    });
  }

  async getContactPoints() {
    const userId = await this.pointProvider.userId();
    this.pointProvider.getContactPoints(userId).subscribe(observe => {
      this.point = observe;
    });
  }

  ionViewDidLoad() {
    this.getContactPoints();
    const contact: contact = this.navParams.get('contact');
    this.pk = contact.pk;
    this.name = contact.name;
    this.status = contact.status;
    this.previousStatus = contact.status;
    this.contactType = contact.contact_type;
    this.previousContactType = contact.contact_type;
    this.contactNo = contact.contact_no;
    this.remark = contact.remark;
  }

}
