import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpfCalculatorPage } from './epf-calculator';

@NgModule({
  declarations: [
    EpfCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(EpfCalculatorPage),
  ],
})
export class EpfCalculatorPageModule {}
