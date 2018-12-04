import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgencyMemberPage } from './agency-member';

@NgModule({
  declarations: [
    AgencyMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(AgencyMemberPage),
  ],
})
export class AgencyMemberPageModule {}
