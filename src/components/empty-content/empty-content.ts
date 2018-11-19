import { Component, Input } from '@angular/core';

@Component({
  selector: 'empty-content',
  templateUrl: 'empty-content.html'
})
export class EmptyContentComponent {

  @Input() buttonText: string;
  @Input() title: string;
  @Input() message: string;
  @Input() submit: any;

  constructor() { }

}
