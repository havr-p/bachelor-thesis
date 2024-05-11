import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalStorageService, AUTH_TOKEN } from '../../services/local-storage/local-storage.service';
import { UserDTO } from '../../../../gen/model';
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";

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
    private route: ActivatedRoute
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
      const succeedParam = params['success'];
      //const githubAccessToken = params['github'];
      this.authenticated = (succeedParam === 'true');
      console.log(succeedParam)
      //console.log(githubAccessToken);
      //this.localStorageService.saveData(AUTH_TOKEN, githubAccessToken);
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
