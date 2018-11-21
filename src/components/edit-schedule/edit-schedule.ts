import { Component } from '@angular/core';

/**
 * Generated class for the EditScheduleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-schedule',
  templateUrl: 'edit-schedule.html'
})
export class EditScheduleComponent {

  text: string;

  constructor() {
    console.log('Hello EditScheduleComponent Component');
    this.text = 'Hello World';
  }

}
