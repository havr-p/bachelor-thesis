import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Attempt to fetch user information with a GET request
    this.http.get<any>('api/user').subscribe({
      next: (data) => {
        this.authenticated = true;
        this.user = data;
      },
      error: () => {
        this.authenticated = false;
      }
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

  signIn() {
    console.log('github')
    window.location.href = environment.apiUrl+ '/oauth2/authorization/github';
  }
}
