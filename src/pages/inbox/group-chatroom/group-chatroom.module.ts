import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatroomPage } from './group-chatroom';

@NgModule({
  declarations: [
    GroupChatroomPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChatroomPage),
  ],
})
export class GroupChatroomPageModule {}
