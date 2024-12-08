import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Movie} from '../../shared/interfaces'
import {MovieService} from '../../shared/movie.service'

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.component.html',
  styleUrls: ['./movie-view.component.css'],
})
export class MovieViewComponent implements OnInit {
  movie!: Movie
  filter!: string | null
  id!: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.filter = this.route.snapshot.queryParamMap.get('filter')
    this.id = this.route.snapshot.paramMap.get('id')!
    this.movieService.movies$.subscribe((movies) => {
      this.movie = movies.find((movie: Movie) => movie?.imdbID === this.id)!
    })
  }

  goBack() {
    this.router.navigate(['/movies'], {
      queryParams: {filter: this.filter},
    })
  }
}
