import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService, AUTH_TOKEN, CURRENT_USER} from '../../services/local-storage/local-storage.service';
import { UserDTO } from '../../../../gen/model';
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";
import {StateManager} from "../../models/state";
import {getSocialLoginUrl} from "../../misc/helpers";
import {AuthService} from "../../services/auth/auth.service";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    ButtonModule,
    AsyncPipe,
    NgIf
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authenticated: boolean = false;
  user: UserDTO | null = null;
  isError: boolean = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Subscribe to currentUser to react to changes
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      this.authenticated = !!user;
    });
    console.log(this.user);
  }


  logout(): void {
    this.authService.logout();
  }

  handleGithubLogin() {
    window.location.href = environment.apiUrl + getSocialLoginUrl('github');
  }

  onProjectsClick() {
    this.router.navigateByUrl('/projects');
  }


}
