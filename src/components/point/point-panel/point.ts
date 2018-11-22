export class Point {

  BaseUrl = '../../../assets/imgs/points/';
  point: any;
  img: string;
  text: string;
  each: number;

  constructor(point: any, img: string, text: string, each: number) {
    this.point = point;
    this.img = this.BaseUrl + img;
    this.text = text;
    this.each = each;
  }

  add() {
    this.point += this.each;
  }
}