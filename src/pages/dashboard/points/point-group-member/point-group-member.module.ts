import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointGroupMemberPage } from './point-group-member';

@NgModule({
  declarations: [
    PointGroupMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(PointGroupMemberPage),
  ],
})
export class PointGroupMemberPageModule {}
