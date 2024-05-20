import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./ui/auth/auth.component";
import {PageNotFoundComponent} from "./ui/page-not-found/page-not-found.component";
import {ProjectMenuComponent} from "./ui/project-menu/project-menu.component";
import {OAuth2RedirectComponent} from "./ui/oauth2-redirect/oauth2-redirect.component";
import {EditorWrapperComponent} from "./ui/editor-wrapper/editor-wrapper.component";

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {
    path: 'editor/:projectId', component: EditorWrapperComponent,
  },
  {
    path: 'editor/:projectId/release/:releaseId', component: EditorWrapperComponent,
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
