import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'dateRange',
})
export class DateRangePipe implements PipeTransform {

  transform(date: Date) {
    if (date.getFullYear() === new Date().getFullYear()) {
      return moment(date).format('D MMM');
    } else {
      return moment(date).format('D MMM YYYY');
    }
  }
}
