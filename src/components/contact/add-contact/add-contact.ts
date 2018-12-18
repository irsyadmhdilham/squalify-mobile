import { Component, ViewChild } from '@angular/core';
import { NavParams } from "ionic-angular";
import { take } from "rxjs/operators";
import {
  ViewController,
  Select,
  AlertController,
  LoadingController,
  ToastController,
  ModalController
} from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";
import { PointProvider } from "../../../providers/point/point";
import { UpdatePoint } from "../../../providers/point/update-point";

import { ContactListComponent } from "../../../components/contact/contact-list/contact-list";
import { contactPoints } from "../../../interfaces/point";
import { contact } from "../../../interfaces/contact";


@Component({
  selector: 'add-contact',
  templateUrl: 'add-contact.html'
})
export class AddContactComponent {

  contactTypeSelectOptions = { title: 'Select contact type' };
  statusSelectOptions = { title: 'Select status' };
  @ViewChild('_contactType') _contactType: Select;
  point: contactPoints;
  contactTypeVal: string;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private contactProvider: ContactProvider,
    private loadingCtrl: LoadingController,
    private pointProvider: PointProvider,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  addContact(nameNgModel, contactTypeNgModel, contactNoNgModel, remarkNgModel) {
    try {
      if (!nameNgModel.valid) {
        throw 'Please insert name';
      }
      if (!contactTypeNgModel.valid) {
        throw 'Please select contact type';
      }
      if (!contactNoNgModel.valid) {
        throw 'Please insert contact no';
      }
      const name = nameNgModel.value,
            contact_type = contactTypeNgModel.value,
            contact_no = contactNoNgModel.value,
            remark = remarkNgModel.value;
      const data: contact = {
        name,
        contact_type,
        contact_no,
        remark: remark === '' ? null : remark
      };
      if (this.point) {
        if (contact_type === 'Referral') {
          const addReferrer = this.modalCtrl.create(ContactListComponent);
          addReferrer.present();
          addReferrer.onDidDismiss((response: contact) => {
            data.referrerId = response.pk;
            this.addContactAction(data);
          });
        } else {
          this.addContactAction(data);
        }
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

  addContactAction(data: contact) {
    const loading = this.loadingCtrl.create({ content: 'Please wait' });
    loading.present();
    const userId = this.pointProvider.userId
    this.contactProvider.addContact(data).pipe(take(1)).subscribe(observe => {
      this.updatePoint(data.contact_type, userId).then(res => {
        loading.dismiss();
        const toast = this.toastCtrl.create({
          message: `Point added, Total ${res.attribute} point: ${res.data.point}`,
          position: 'top',
          duration: 1500
        });
        toast.present();
        toast.onDidDismiss(() => {
          this.viewCtrl.dismiss({
            newContact: observe
          });
        })
      }).catch(() => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Failed to update point',
          buttons: ['Ok']
        });
        alert.present();
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
  }

  getContactPoints() {
    this.pointProvider.getContactPoints().subscribe(observe => {
      this.point = observe;
    });
  }

  ionViewDidLoad() {
    this.getContactPoints();
    const contactType = this.navParams.get('contactType');
    if (contactType) {
      this.contactTypeVal = contactType;
    }
  }

  updatePoint(contactType: string, userId): Promise<{attribute: string; data: any}> {
    let point, pk, attrPk, attribute, each;
    if (contactType === 'Referral') {
      pk = this.point.pk;
      point = this.point.referrals.point;
      attrPk = this.point.referrals.pk;
      each = 1;
      attribute = 'Referrals';
    } else {
      pk = this.point.pk;
      point = this.point.ftf.point;
      attrPk = this.point.ftf.pk;
      each = 2;
      attribute = 'FTF/Nesting/Booth';
    }
    const update = new UpdatePoint(this.pointProvider, pk, point, attribute, attrPk, each);
    return new Promise<{attribute: string; data: any}>((resolve, reject) => {
      update.add().then(data => {
        resolve({attribute, data});
      }).catch(err => {
        reject({attribute, err});
      });
    });
  }

}
