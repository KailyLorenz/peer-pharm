import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core'
import {Subscription} from 'rxjs'
import {ActivatedRoute, Router} from '@angular/router'
import {Movie} from '../../shared/interfaces'
import {MovieService} from '../../shared/movie.service'
import {ToastService} from '../../shared/toast/toast.service'

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnDestroy {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>
  @Input() movie!: Movie
  @Input() filter!: string
  @Input() isMovieDetails!: boolean
  updateMovieSubscription!: Subscription
  errorLoadingMovie: {[id: string]: boolean} = {}
  editingMovieId!: string
  editableTitle!: string
  hasTextBeenSelected: boolean = false
  id: string = ''
  errorMessage: string = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private toastService: ToastService
  ) {}

  onImageError(event: Event, imdbID: string): void {
    if (event.type === 'error') {
      this.errorLoadingMovie[imdbID] = true
    }
  }

  selectText(): void {
    if (!this.hasTextBeenSelected) {
      const input = this.inputElement.nativeElement
      input.setSelectionRange(
        this.editableTitle.length,
        this.editableTitle.length
      )
      input.focus()
      input.select()
      this.hasTextBeenSelected = true
    }
  }

  enableEditing(movie: Movie): void {
    this.editingMovieId = movie.imdbID
    this.editableTitle = movie.title
    this.hasTextBeenSelected = false
  }

  cancelEditing(): void {
    this.editingMovieId = ''
  }

  saveChanges(movie: Movie): void {
    if (this.editableTitle.trim().length < 3) {
      this.errorMessage = 'The title must be at least 3 characters long.'
      return
    }
    if (this.editableTitle.trim() !== movie.title) {
      movie.title = this.editableTitle.trim()
      this.updateMovieSubscription = this.movieService
        .updateMovie(movie)
        .subscribe({
          next: () => {
            this.toastService.showToast(
              'The movie title has been successfully saved'
            )
            console.log('Movie updated successfully!')
          },
          error: () => {
            console.error('Failed to update movie. Reverting changes...')
            this.editableTitle = movie.title
          },
        })
    }
    this.editingMovieId = ''
  }

  ngOnDestroy(): void {
    if (this.updateMovieSubscription) {
      this.updateMovieSubscription.unsubscribe()
    }
  }
}
