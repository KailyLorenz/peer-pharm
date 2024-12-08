import {Component, OnDestroy} from '@angular/core'
import {ToastService} from './toast.service'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnDestroy {
  toastMessage: string = ''
  showToast: boolean = false
  toastSubscription!: Subscription

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState$.subscribe(
      (state) => {
        this.toastMessage = state.message
        this.showToast = state.show
      }
    )
  }

  closeToast(): void {
    this.toastService.hideToast()
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe()
    }
  }
}
