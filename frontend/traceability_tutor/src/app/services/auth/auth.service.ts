import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {CredentialsDTO, SignUpDTO, UserDTO} from "../../../../gen/model";
import {AuthControllerService} from "../../../../gen/services/auth-controller";
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
    private router: Router,
    private localStorageService: LocalStorageService,
    private authController: AuthControllerService,
    private eventService: EventService,
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
          next: accessToken => {
            const user = parseUserFromJwt(accessToken);
            const authenticatedUser = {user, accessToken}
            this.localStorageService.saveData("user", authenticatedUser);
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 400) this.eventService.notify("User with given credentials was not found.", 'error');
          }
        });
  }

  public signup(signupDTO: SignUpDTO) {
    this.authController.register(signupDTO).subscribe({
      next: token => {
        console.log(typeof token); // Should print "string"
        console.log(token); // Directly log the token string

        const user = parseUserFromJwt(token);
        const authenticatedUser = { user, accessToken: token };
        this.localStorageService.saveData('user', authenticatedUser);
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
