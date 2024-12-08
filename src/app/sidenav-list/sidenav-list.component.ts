import {Component, OnDestroy, OnInit} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {Router} from '@angular/router'
import {ActionsService} from '../shared/actions.service'
import {MovieService} from '../shared/movie.service'
import {AccMovie} from '../shared/interfaces'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  activeFilter: string = 'all'
  isTable: boolean = false
  movies!: Observable<AccMovie[]>
  movieSub!: Subscription
  isViewing: boolean = false
  routerSubscription!: Subscription;

  constructor(
    private movieService: MovieService,
    private actionsService: ActionsService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isViewing = this.router.url.includes('/movies/')
    })
  }

  changeViewListMovies() {
    this.isTable = !this.isTable
    this.actionsService.setViewTable(this.isTable)
  }

  ngOnInit(): void {
    this.movies = this.movieService.countTypeMovie$
  }

  setFilter(filter: string): void {
    this.activeFilter = filter
    if (this.router.url.includes('/movies/')) {
      this.router.navigate(['/movies'], {
        queryParams: {filter},
        queryParamsHandling: 'merge',
      })
    } else {
      this.router.navigate([], {
        queryParams: {filter},
        queryParamsHandling: 'merge',
      })
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }
}
