import { Directive, ElementRef } from '@angular/core';
import { Colors } from "../../functions/colors";

@Directive({
  selector: '[content-bg]'
})
export class ContentBgDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = Colors.light;
  }

}
