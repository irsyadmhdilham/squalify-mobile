import { Component } from '@angular/core';

/**
 * Generated class for the FetchErrorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fetch-error',
  templateUrl: 'fetch-error.html'
})
export class FetchErrorComponent {

  text: string;

  constructor() {
    console.log('Hello FetchErrorComponent Component');
    this.text = 'Hello World';
  }

}
