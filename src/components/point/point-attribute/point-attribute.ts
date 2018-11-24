import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AlertController, LoadingController } from "ionic-angular";

import { PointProvider } from "../../../providers/point/point";

import { point } from "../../../interfaces/point";

@Component({
  selector: 'point-attribute',
  templateUrl: 'point-attribute.html'
})
export class PointAttributeComponent implements OnChanges {

  @Input() img: string;
  @Input() attribute: string;
  @Input() each: number;
  @Input() editMode: boolean;
  @Input() todayPoint: point;
  @Input() pointType: string;
  @Output() updatePoint = new EventEmitter();
  point = 0;
  pk: number;
  attrPk: number;
  baseUrl = '../../../assets/imgs/points/';

  constructor(private pointProvider: PointProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  add() {
    this.point += this.each;
    this.addMinus('add');
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    this.pointProvider.userId().then(userId => {
      const data = {
        pk: this.pk,
        point: this.point,
        attribute: this.attribute,
        attr_pk: this.attrPk
      };
      loading.present();
      if (this.pk) {
        this.pointProvider.updatePoint(userId, this.pk, data).subscribe(observe => {
          loading.dismiss();
          const attr = observe.attributes.filter(val => val.attribute === this.attribute)[0];
          this.attrPk = attr.pk;
        }, (err: Error) => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error has occured',
            subTitle: err.message,
            buttons: ['Ok']
          });
          alert.present();
        });
      } else {
        this.pointProvider.createPoint(userId, data).subscribe(observe => {
          loading.dismiss();
          this.pk = observe.pk;
          const attribute = observe.attributes.filter(val => val.attribute === this.attribute)[0];
          if (attribute) {
            this.attrPk = attribute.pk;
          }
        }, (err: Error) => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error has occured',
            subTitle: err.message,
            buttons: ['Ok']
          });
          alert.present();
        });
      }
    });
  }

  minus() {
    if (this.point !== 0) {
      this.point -= this.each;
      this.addMinus('minus');
    }
  }

  ngOnChanges() {
    if (this.todayPoint) {
      this.pk = this.todayPoint.pk;
      const attribute = this.todayPoint.attributes.filter(val => val.attribute === this.attribute)[0];
      if (attribute) {
        this.attrPk = attribute.pk;
        this.point = attribute.point;
      }
    }
  }

  addMinus(type) {
    this.updatePoint.emit({ type, pointType: this.pointType, point: this.each });
  }

}
