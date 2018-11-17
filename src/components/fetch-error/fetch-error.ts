import { Component, Input } from '@angular/core';

@Component({
  selector: 'fetch-error',
  templateUrl: 'fetch-error.html'
})
export class FetchErrorComponent {

  @Input() message: string;
  @Input() retry: any;

  constructor() { }

}
