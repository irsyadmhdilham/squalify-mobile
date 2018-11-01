import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[title]' // Attribute selector
})
export class TitleDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.fontWeight = 'bold';
  }

}
