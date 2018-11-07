import { Pipe, PipeTransform } from '@angular/core';
import { roundDecimal } from "../../functions/number-commas";

@Pipe({
  name: 'numCommas',
})
export class NumCommasPipe implements PipeTransform {

  transform(value: number) {
    if (isNaN(value)) {
      return 0;
    }
    return roundDecimal(value);
  }
}
