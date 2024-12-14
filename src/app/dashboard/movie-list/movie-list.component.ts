import {Component, OnDestroy, OnInit} from '@angular/core'
import {combineLatest, debounceTime, map, Subscription, switchMap} from 'rxjs'
import {ActivatedRoute} from '@angular/router'
import {MovieService} from '../../shared/movie.service'
import {ActionsService} from '../../shared/actions.service'
import {Movie} from '../../shared/interfaces'

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[] = []
  movieSub!: Subscription
  filteredMovies: Movie[] = []
  sortDirection!: boolean
  filter: string = 'all'
  isViewTable: boolean = false
  viewTableSub!: Subscription
  isLoading: boolean = false

  constructor(
    private actionsService: ActionsService,
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchMovies()
    this.initializeSubscriptions()
  }

  private fetchMovies(): void {
    this.isLoading = !this.isLoading
    this.movieSub = combineLatest([
      this.route.queryParams.pipe(map((params) => params['filter'] || 'all')),
      this.actionsService.sortDirection$,
      this.actionsService.searchQuery$.pipe(debounceTime(300)),
    ])
      .pipe(
        switchMap(([filter, sortDirection, query]) =>
          this.movieService.fetchMovies().pipe(
            map((movies: Movie[]) => {
              // Filter by Category
              const filteredMoviesRouting =
                typeof filter === 'string'
                  ? filter === 'all'
                    ? movies
                    : movies.filter((movie: Movie) => movie.type === filter)
                  : movies
              this.filter = filter

              // Filter by Search
              if (this.movies.length === 0) {
                this.movies = filteredMoviesRouting.slice()
              }
              const filteredMoviesBySearch =
                query.length > 0
                  ? filteredMoviesRouting.filter((movie: Movie) =>
                      movie.title.toLowerCase().includes(query.toLowerCase())
                    )
                  : filteredMoviesRouting
              return {
                filteredMoviesBySearch,
                sortDirection,
              }
            })
          )
        )
      )
      .subscribe({
        next: ({filteredMoviesBySearch, sortDirection}) => {
          this.filteredMovies = filteredMoviesBySearch
          this.sortDirection = sortDirection
          this.isLoading = false
        },
        error: (err) => {
          console.error('Error fetching movies:', err)
          this.isLoading = false
        }
      })
  }

  private initializeSubscriptions(): void {
    this.viewTableSub = this.actionsService.viewTable$.subscribe(
      (isViewTable: boolean) => {
        this.isViewTable = isViewTable
      }
    )
  }

  ngOnDestroy(): void {
    if (this.viewTableSub) {
      this.viewTableSub.unsubscribe()
    }
    if (this.movieSub) {
      this.movieSub.unsubscribe()
    }
  }
}
