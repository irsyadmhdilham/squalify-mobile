import { Component } from '@angular/core';

/**
 * Generated class for the CustomReminderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-reminder',
  templateUrl: 'custom-reminder.html'
})
export class CustomReminderComponent {

  text: string;

  constructor() {
    console.log('Hello CustomReminderComponent Component');
    this.text = 'Hello World';
  }

}
