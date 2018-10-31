import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[comp-margin]'
})
export class CompMarginDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.marginTop = '8px';
  }

}
