import { Directive, ElementRef } from '@angular/core';
import { Colors } from "../../functions/colors";

@Directive({
  selector: '[content-bg]' // Attribute selector
})
export class ContentBgDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = Colors.light;
  }

}
