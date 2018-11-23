import { PointProvider } from "../../../providers/point/point";

export class Point {

  BaseUrl = '../../../assets/imgs/points/';
  pk: number;
  attrPk: number;
  point: number;
  img: string;
  attribute: string;
  each: number;

  constructor(point: any, img: string, attribute: string, each: number, public pointProvider: PointProvider) {
    this.img = this.BaseUrl + img;
    this.attribute = attribute;
    this.each = each;
    this.point = 0;
    if (point) {
      this.pk = point.pk;
      const attr = point.attributes.filter(val => val.attribute === attribute);
      if (attr.length > 0) {
        this.point = attr[0].point;
        this.attrPk = attr[0].pk;
      }
    }
  }

  add() {
    this.point += this.each;
    // this.pointProvider.userId().then(userId => {
    //   const data = {
    //     pk: this.pk,
    //     point: this.point,
    //     attribute: this.attribute,
    //     attr_pk: this.attrPk
    //   };
    //   if (this.pk) {
    //     this.pointProvider.updatePoint(userId, this.pk, data).subscribe(observe => {
    //       const attr = observe.attributes.filter(val => val.attribute === this.attribute)[0];
    //       this.attrPk = attr.pk;
    //     }, (err: Error) => {
    //       console.log(err);
    //     });
    //   } else {
    //     this.pointProvider.createPoint(userId, data).subscribe(() => {
    //     }, (err: Error) => {
    //       console.log(err);
    //     });
    //   }
    // });
  }
}