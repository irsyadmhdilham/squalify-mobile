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

import { contact } from "../../../models/contact";
import { contactPoints } from "../../../models/point";

import { ContactProvider } from "../../../providers/contact/contact";
import { PointProvider } from "../../../providers/point/point";
import { UpdatePoint } from "../../../providers/point/update-point";

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

  updatePoint(): Promise<any> {
    let point = this.point.app_sec.point,
        pk = this.point.pk,
        attrPk = this.point.app_sec.pk;
    const update = new UpdatePoint(this.pointProvider, pk, point, 'Appointment secured', attrPk, 2);
    return new Promise<any>((resolve, reject) => {
      update.add().then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      });
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
      const data: contact = {
        name,
        status,
        contact_type,
        contact_no,
        remark: remark === '' ? null : remark
      };
      const loading = this.loadingCtrl.create({content: 'Please wait...'});
      if (statusNgModel.value === 'Appointment secured' && statusNgModel.dirty && this.point) {
        const modal = this.modalCtrl.create(AddScheduleComponent);
        modal.present();
        modal.onDidDismiss(cb => {
          if (cb) {
            data.scheduleId = cb.schedule.pk;
            this.updatePoint().then(() => {
              this.updateContactSubmit(data, 'add point', loading);
            });
          }
        });
      } else {
        this.updateContactSubmit(data, null, loading);
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

  updateContactSubmit(data, type, loading) {
    if (!type) {
      loading.present();
    }
    this.contactProvider.updateContact(this.pk, data).subscribe(observe => {
      loading.dismiss();
      const toast = this.toastCtrl.create({
        message: `Point added, Total Appointment secured point: ${this.point.app_sec.point + 2}`,
        position: 'top',
        duration: 1500
      });
      const data = {
        name: observe.name,
        status: observe.status,
        contact_type: observe.contact_type,
        contact_no: observe.contact_no,
        remark: observe.remark,
        edited: true
      }
      if (type) {
        toast.present();
        toast.onDidDismiss(() => {
          this.viewCtrl.dismiss({...data});
        });
      } else {
        this.viewCtrl.dismiss({...data});
      }
    }, (err: Error) => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  getContactPoints() {
    this.pointProvider.getContactPoints().subscribe(observe => {
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
