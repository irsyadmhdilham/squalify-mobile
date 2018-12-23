import { point } from "../../../../models/point";

export class Attribute {
  baseUrl = '../../../../assets/imgs/points/';
  point: number;
  img: string;
  attribute: string;
  each: number;

  constructor(point: point, img: string, attribute: string, each: number) {
    this.img = this.baseUrl + img;
    this.attribute = attribute;
    this.each = each;
    const attr = point.attributes.filter(val => val.attribute === attribute);
    if (attr.length > 0) {
      this.point = attr[0].point;
    } else {
      this.point = 0;
    }
  }
}