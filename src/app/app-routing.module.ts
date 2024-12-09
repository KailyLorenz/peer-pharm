import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'
import {MovieViewComponent} from './dashboard/movie-view/movie-view.component'
import {DashboardComponent} from './dashboard/dashboard.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    component: DashboardComponent,
  },
  {
    path: 'movies/:id',
    component: MovieViewComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
