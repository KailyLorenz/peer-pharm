import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'
import {AppComponent} from './app.component'
import {SidenavListComponent} from './sidenav-list/sidenav-list.component'
import {DashboardComponent} from './dashboard/dashboard.component'
import {ActionsComponent} from './dashboard/actions/actions.component'
import {MovieListComponent} from './dashboard/movie-list/movie-list.component'
import {ActionsService} from './shared/actions.service'
import {MovieService} from './shared/movie.service'
import {SortPipe} from './shared/sort.pipe'
import {SpinnerComponent} from './shared/spinner/spinner.component'
import {MovieViewComponent} from './dashboard/movie-view/movie-view.component'
import {AppRoutingModule} from './app-routing.module'
import {MovieComponent} from './dashboard/movie/movie.component'
import {TooltipDirective} from './shared/tooltip.directive'
import {ToastComponent} from './shared/toast/toast.component'
import {ToastService} from './shared/toast/toast.service'

@NgModule({
  declarations: [
    AppComponent,
    SidenavListComponent,
    DashboardComponent,
    ActionsComponent,
    MovieListComponent,
    SpinnerComponent,
    MovieViewComponent,
    MovieComponent,
    SortPipe,
    TooltipDirective,
    ToastComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [ActionsService, MovieService, ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
