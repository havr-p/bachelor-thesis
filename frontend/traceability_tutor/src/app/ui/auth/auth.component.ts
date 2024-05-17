import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService, AUTH_TOKEN, CURRENT_USER} from '../../services/local-storage/local-storage.service';
import {CredentialsDTO, SignUpDTO, UserDTO} from '../../../../gen/model';
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";
import {StateManager} from "../../models/state";
import {getSocialLoginUrl} from "../../misc/helpers";
import {AuthService} from "../../services/auth/auth.service";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {TabViewModule} from "primeng/tabview";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    ButtonModule,
    AsyncPipe,
    NgIf,
    SignupComponent,
    LoginComponent,
    TabViewModule
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authenticated: boolean = false;
  currentUser: UserDTO | null = null;
  isError: boolean = false;
  activeIndex = 0;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }


  logout(): void {
    this.authService.logout();
  }

  handleGithubLogin() {
    console.log('handleGithubLogin')
    window.location.href = environment.apiUrl + getSocialLoginUrl('github');
  }

  handleLocalLogin($event: CredentialsDTO) {
    console.log('handle local Login')
    this.authService.localLogin($event);
  }

  handleSignUp($event: SignUpDTO) {
    console.log($event);
    this.authService.signup($event);
  }

  onProjectsClick() {
    this.router.navigateByUrl('/projects');
  }


}
