import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[img-title]'
})
export class ImgTitleDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.width = '5em';
  }

}
