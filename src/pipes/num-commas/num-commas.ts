import { Pipe, PipeTransform } from '@angular/core';
import { roundDecimal } from "../../functions/number-commas";

@Pipe({
  name: 'numCommas',
})
export class NumCommasPipe implements PipeTransform {

  transform(value: number) {
    return roundDecimal(value);
  }
}
