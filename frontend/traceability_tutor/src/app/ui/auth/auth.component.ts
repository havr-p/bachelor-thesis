import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService, AUTH_TOKEN, CURRENT_USER} from '../../services/local-storage/local-storage.service';
import { UserDTO } from '../../../../gen/model';
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";
import {StateManager} from "../../models/state";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    NgIf,
    ButtonModule
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authenticated: boolean = false;
  user: any;
  private authSuccess: boolean | undefined;

  constructor(
    private http: HttpClient,
    protected router: Router,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    protected stateManager: StateManager,
  ) {}

  ngOnInit(): void {
    // Attempt to fetch user information with a GET request
    console.log("on init")
    // this.http.get('api/user').subscribe({
    //   next: (data) => {
    //     this.authenticated = true;
    //     this.user = data;
    //     console.log(this.user);
    //   },
    //   error: (err) => {
    //     console.log(err)
    //     this.authenticated = false;
    //   }
    // });
    this.route.queryParams.subscribe(params => {
      // Retrieve and parse the `authSuccess` query parameter
      const success = Boolean(params['success'] as string);
      if (success) {
        this.localStorageService.removeData(CURRENT_USER);
        const gitHubLogin = params['login'];
        const id = params['id'] as number;
        this.stateManager.currentUser = {gitHubLogin: gitHubLogin, id: id};
      }
      this.authenticated = success

    });
  }

  logout(): void {
    this.http.post('api/logout', {}).subscribe({
      next: () => {
        this.localStorageService.removeData(AUTH_TOKEN);
        this.authenticated = false;
        this.user = undefined;
        this.router.navigate(['/']);
      },
      error: () => {
        console.error('Logout failed');
      }
    });
  }

  handleGithubLogin() {
    window.location.href = environment.apiUrl + '/oauth2/authorization/github';
  }

  onProjectsClick() {
    this.router.navigateByUrl('/projects');
  }

}
