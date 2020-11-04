import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[spinner-host]',
})
export class SpinnerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
