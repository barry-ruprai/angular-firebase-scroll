import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  ElementRef
} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[scrollable]'
})
export class ScrollableDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) {}

  @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
    try {
      const top = event.target['scrollingElement'].scrollTop; // = window.pageYOffset or window.scrollY
      const height = this.el.nativeElement.scrollHeight; // = document.body.scrollHeight or document.body.offsetHeight
      const element = this.el.nativeElement;

      if (window.innerHeight + top >= height) {
        this.scrollPosition.emit('bottom');
      }

      if (top === 0) {
        this.scrollPosition.emit('top');
      }
    } catch (err) {}
  }
}
