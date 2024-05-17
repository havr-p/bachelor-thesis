import {EventEmitter, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {CredentialsDTO, SignUpDTO, UserDTO} from "../../../../gen/model";
import {AuthControllerService, AuthResponse} from "../../../../gen/services/auth-controller";
import {parseUserFromJwt} from "../../misc/helpers";
import {EventService} from "../event/event.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserDTO | null>;
  public currentUser: Observable<UserDTO | null>;

  constructor(
    private localStorageService: LocalStorageService,
    private eventService: EventService,
    private authController: AuthControllerService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO | null>(this.localStorageService.getData('user'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  saveAndSetUser(user: UserDTO) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  public localLogin(credentials: CredentialsDTO) {
    this.authController.login(credentials).subscribe({
      next: authResponse => {
        this.handleAuthorization(authResponse);
        this.eventService.notify('Login successful!', 'success');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.eventService.notify('User with given credentials was not found.', 'error');
        }
      }
    });
  }

  private handleAuthorization(authResponse: AuthResponse) {
    const accessToken = authResponse.accessToken;
    const user = parseUserFromJwt(accessToken);
    const authenticatedUser = {...user, accessToken} as UserDTO;
    this.localStorageService.saveData('user', authenticatedUser);
    this.currentUserSubject.next(authenticatedUser);  // Update the BehaviorSubject
  }

  public signup(signupDTO: SignUpDTO) {
    this.authController.register(signupDTO).subscribe({
      next: authResponse => {
        this.handleAuthorization(authResponse);
        this.eventService.notify('Registration of new user was successful! You can sign in now.', 'success');
      },
      error: err => {
        if (err.status != 200)
        this.eventService.notify('Error occurred: status ' + err.status + ' - ' + err.error.message, 'error');
        console.log("error is", err);
      }
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    if (!user) {
      return false;
    }
    const parsedUser = JSON.parse(user) as UserDTO;
    if (Date.now() > new Date(parsedUser.tokenExpiry).getTime()) {
      this.logout();
      return false;
    }
    return true;
  }

}
