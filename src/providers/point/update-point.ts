import { PointProvider } from "./point";

interface response {
  status: boolean;
  point: number;
}

export class UpdatePoint {
  userId;
  pk: number;
  each: number;
  attribute: string;
  attrPk: number;
  point: number;

  constructor(
    public pointProvider: PointProvider,
    userId,
    pk: number,
    point: number,
    attribute: string,
    attrPk: number,
    each: number
  ) {
    this.pk = pk;
    this.attribute = attribute;
    this.attrPk = attrPk;
    this.each = each;
    this.point = point;
    this.userId = userId;
  }

  add(): Promise<response> {
    const data = { pk: this.pk, point: this.point + this.each, attribute: this.attribute, attr_pk: this.attrPk };
    return new Promise<response>((resolve, reject) => {
      //if point had created, just update the point
      if (this.pk) {
        this.pointProvider.updatePoint(this.userId, this.pk, true, data).subscribe(() => {
          const response = {
            status: true,
            point: this.point + this.each
          }
          resolve(response);
        }, () => {
          const response = {
            status: false,
            point: this.point
          }
          reject(response);
        });
      } else {
        this.pointProvider.createPoint(this.userId, true, data).subscribe(() => {
          const response = {
            status: true,
            point: this.point + this.each
          }
          resolve(response)
        }, () => {
          const response = {
            status: false,
            point: this.point
          }
          reject(response);
        });
      }
    }); 
  }
}