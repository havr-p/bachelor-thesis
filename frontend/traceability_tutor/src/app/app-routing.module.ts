import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditorComponent} from "./ui/editor/editor.component";
import {AuthComponent} from "./ui/auth/auth.component";
import {PageNotFoundComponent} from "./ui/page-not-found/page-not-found.component";
import {ProjectMenuComponent} from "./ui/project-menu/project-menu.component";
import {OAuth2RedirectComponent} from "./ui/oauth2-redirect/oauth2-redirect.component";

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {
    path: 'editor/:projectId', component: EditorComponent,
  },
  {
    path: 'editor/:projectId/release/:releaseId', component: EditorComponent,
  },
  {path: 'projects', component: ProjectMenuComponent},
  {path: 'oauth2/redirect', component: OAuth2RedirectComponent},
  {path: '', redirectTo: '/auth', pathMatch: 'full'}, //login redirect by default
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
