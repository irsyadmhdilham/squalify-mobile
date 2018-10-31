import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplicationsPage } from './applications';

@NgModule({
  declarations: [
    ApplicationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplicationsPage),
  ],
})
export class ApplicationsPageModule {}
