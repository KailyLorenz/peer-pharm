import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import {AccMovie, AngularResponseDB, Movie} from './interfaces'

@Injectable()
export class MovieService {
  movies: Movie[] = []
  private refreshTrigger = new Subject<void>()
  private countTypeMovieSubject = new Subject<AccMovie[]>()
  countTypeMovie$ = this.countTypeMovieSubject.asObservable()
  private moviesSubject = new BehaviorSubject<Movie[]>([])
  movies$ = this.moviesSubject.asObservable()
  private dataLoaded = false
  private destroy$ = new Subject<void>()

  constructor(private httpClient: HttpClient) {
    this.refreshTrigger
      .pipe(
        switchMap(() =>
          this.fetchMovies().pipe(
            tap((movies) => this.moviesSubject.next(movies)),
            catchError((error) => {
              console.error('Error loading movies:', error)
              this.moviesSubject.next([])
              return of([])
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe()
  }

  fetchMovies(): Observable<Movie[]> {
    return this.dataLoaded
      ? this.movies$
      : this.httpClient
          .get<AngularResponseDB>('/assets/angular_data.json')
          .pipe(
            map((res: AngularResponseDB) => {
              this.movies = res.results.map((movie: any) => ({
                imdbID: movie.imdbID,
                title: movie.Title,
                year: movie.Year,
                type: movie.Type,
                poster: movie.Poster,
              }))
              this.getTypesCountMovie()
              this.moviesSubject.next(this.movies)
              this.dataLoaded = true
              console.log('API')
              return this.movies
            }),
            catchError((error) => {
              console.error('Error loading data:', error)
              this.moviesSubject.next([])
              return of([])
            })
          )
  }

  refreshMovies(): void {
    this.dataLoaded = false
    this.moviesSubject.next([])
    this.refreshTrigger.next()
  }

  private getTypesCountMovie(): void {
    const typeCount: Record<string, number> = {}

    this.movies.forEach((movie) => {
      typeCount[movie.type] = (typeCount[movie.type] || 0) + 1
    })
    const moviesTypeCount = [
      {type: 'all', count: this.movies.length},
      ...Object.keys(typeCount).map((type) => ({
        type,
        count: typeCount[type],
      })),
    ]
    this.countTypeMovieSubject.next(moviesTypeCount)
  }

  destroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  updateMovie(updatedMovie: Movie): Observable<Movie[]> {
    const updatedMovies = this.moviesSubject.value.map((movie) =>
      movie.imdbID === updatedMovie.imdbID ? updatedMovie : movie
    )
    // imitation server
    this.moviesSubject.next(updatedMovies)
    this.httpClient
      .put(`/assets/angular_data/${updatedMovie.imdbID}.json`, updatedMovie)
      .pipe(
        tap(() => {
          console.log('Movie updated successfully!')
        }),
        catchError((error) => {
          console.error('Error updating movie:', error)
          return of(error)
        })
      )
    return this.movies$
  }
}
