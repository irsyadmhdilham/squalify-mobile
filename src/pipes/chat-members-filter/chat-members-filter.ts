import { Pipe, PipeTransform } from '@angular/core';

import { member } from "../../models/agency";

@Pipe({
  name: 'chatMembersFilter',
})
export class ChatMembersFilterPipe implements PipeTransform {

  transform(members: member[], search: string) {
    const regex = new RegExp(search, 'i');
    return members.filter(val => val.name.match(regex));
  }
}
