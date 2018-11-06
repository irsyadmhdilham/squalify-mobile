import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { Colors } from "../../functions/colors";

@Directive({
  selector: '[header-button]'
})
export class HeaderButtonDirective implements OnChanges {

  @Input() activeButton: boolean;

  constructor(private el: ElementRef) {
    const elem = this.el.nativeElement.style;
    elem.padding = '0.5em';
    elem.background = 'pink';
    elem.borderRadius = '5px';
  }

  ngOnChanges() {
    const elem = this.el.nativeElement.style;
    if (this.activeButton) {
      elem.border = 'solid 1px transparent';
      elem.background = Colors.primary;
    } else {
      elem.border = `solid 1px ${Colors.dark}`;
      elem.background = 'transparent';
    }
  }

}
