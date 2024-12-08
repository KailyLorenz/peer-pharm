import {BehaviorSubject, Subject} from 'rxjs'

export class ActionsService {
  private eventSubject = new Subject<boolean>()
  viewTable$ = this.eventSubject.asObservable()
  private filterSubject = new BehaviorSubject<string>('all')
  filter$ = this.filterSubject.asObservable()
  private sortDirectionSubject = new BehaviorSubject<boolean>(true)
  sortDirection$ = this.sortDirectionSubject.asObservable()
  private refreshMoviesSubject = new Subject<boolean>()
  refreshMovies$ = this.refreshMoviesSubject.asObservable()
  private clearSearchSubject = new Subject<boolean>()
  clearSearch$ = this.clearSearchSubject.asObservable()
  private searchQuerySubject = new BehaviorSubject<string>('')
  searchQuery$ = this.searchQuerySubject.asObservable()

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query)
  }

  refreshMovies(): void {
    this.refreshMoviesSubject.next(true)
  }

  setSortDirection(direction: boolean): void {
    this.sortDirectionSubject.next(direction)
  }

  setFilter(filter: string): void {
    this.filterSubject.next(filter)
  }

  setViewTable(isTable: boolean): void {
    this.eventSubject.next(isTable)
  }
}
