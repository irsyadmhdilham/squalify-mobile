import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[num-style]'
})
export class NumStyleDirective implements OnInit {

  @Input() numFontSize: string;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.fontWeight = '300';
  }

  ngOnInit() {
    if (this.numFontSize) {
      this.el.nativeElement.style.fontSize = this.numFontSize;
    } else {
      this.el.nativeElement.style.fontSize = '3em';
    }
  }

}
