
import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[delay]'
})
export class DelayDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set delay(time: number) {

    setTimeout(() => {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }, time)

  }

}