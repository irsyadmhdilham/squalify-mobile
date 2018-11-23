import { Component, Input, OnChanges } from '@angular/core';

import { PointProvider } from "../../../providers/point/point";

import { point } from "../../../interfaces/point";

@Component({
  selector: 'point-attribute',
  templateUrl: 'point-attribute.html'
})
export class PointAttributeComponent implements OnChanges {

  @Input() point: point;
  @Input() img: string;
  @Input() attribute: string;
  @Input() each: number;
  pk: number;
  attrPk: number;
  baseUrl = '../../../assets/imgs/points/';

  constructor(private pointProvider: PointProvider) { }

  ngOnChanges() {
    
  }

}
