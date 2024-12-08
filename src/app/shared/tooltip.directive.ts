import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core'
import {Tooltip} from 'bootstrap'

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') tooltipText!: string
  private tooltipInstance: any

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.tooltipInstance = new Tooltip(this.el.nativeElement, {
      title: this.tooltipText,
      placement: 'bottom',
    })
    this.el.nativeElement.addEventListener('click', () => {
      this.hideTooltip()
    })
  }

  ngOnDestroy() {
    this.disposeTooltip()
  }

  private hideTooltip() {
    if (this.tooltipInstance) {
      this.tooltipInstance.hide()
    }
  }

  private disposeTooltip() {
    if (this.tooltipInstance) {
      this.tooltipInstance.dispose()
      this.tooltipInstance = null
    }
  }
}
