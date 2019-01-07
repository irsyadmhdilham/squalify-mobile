import { Component } from '@angular/core';

/**
 * Generated class for the EditAgencyComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-agency',
  templateUrl: 'edit-agency.html'
})
export class EditAgencyComponent {

  text: string;

  constructor() {
    console.log('Hello EditAgencyComponent Component');
    this.text = 'Hello World';
  }

}
