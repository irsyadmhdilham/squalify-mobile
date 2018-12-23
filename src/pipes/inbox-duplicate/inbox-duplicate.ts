import { Pipe, PipeTransform } from '@angular/core';

import { inbox } from "../../interfaces/inbox";

@Pipe({
  name: 'inboxDuplicate',
})
export class InboxDuplicatePipe implements PipeTransform {
  
  transform(inboxes: inbox[]) {
    return inboxes.filter((val, i, arr) => {
      return arr.indexOf(val) === i;
    });
  }
}
