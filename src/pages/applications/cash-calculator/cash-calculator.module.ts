import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashCalculatorPage } from './cash-calculator';

@NgModule({
  declarations: [
    CashCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(CashCalculatorPage),
  ],
})
export class CashCalculatorPageModule {}
