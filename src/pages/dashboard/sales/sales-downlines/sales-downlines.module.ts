import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesDownlinesPage } from './sales-downlines';

@NgModule({
  declarations: [
    SalesDownlinesPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesDownlinesPage),
  ],
})
export class SalesDownlinesPageModule {}
