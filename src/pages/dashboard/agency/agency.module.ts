import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgencyPage } from './agency';

@NgModule({
  declarations: [
    AgencyPage,
  ],
  imports: [
    IonicPageModule.forChild(AgencyPage),
  ],
})
export class AgencyPageModule {}
