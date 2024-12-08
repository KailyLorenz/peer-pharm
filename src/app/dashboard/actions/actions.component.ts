import {Component, OnDestroy, OnInit} from '@angular/core'
import {Subscription} from 'rxjs'
import {ActionsService} from '../../shared/actions.service'
import {MovieService} from '../../shared/movie.service'

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
})
export class ActionsComponent implements OnInit, OnDestroy {
  sortDirection: boolean = true
  query: string = ''
  querySubscription!: Subscription

  constructor(
    private actionsService: ActionsService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.actionsService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query
      }
    )
  }

  toggleSort(): void {
    this.sortDirection = !this.sortDirection
    this.actionsService.setSortDirection(this.sortDirection)
  }

  refreshMovies(): void {
    this.movieService.refreshMovies()
  }

  onInputChange(): void {
    this.actionsService.updateSearchQuery(this.query)
  }

  clearSearch(): void {
    this.actionsService.updateSearchQuery('')
    this.query = ''
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
    }
  }
}
