import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, AUTH_TOKEN } from '../../services/local-storage/local-storage.service';
import { UserDTO } from '../../../../gen/model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
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
    this.http.get<any>('/user').subscribe({
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
    this.http.post('/logout', {}).subscribe({
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
}
