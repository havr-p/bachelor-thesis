import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {parseUserFromJwt} from "../../misc/helpers";
import {EventService} from "../event/event.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthResponse, LoginRequest, SignUpRequest, UserDTO} from "../../../../gen/model";
import {AuthControllerService} from "../../../../gen/services/auth-controller";

export type User = UserDTO & AuthResponse;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private localStorageService: LocalStorageService,
    private eventService: EventService,
    private authController: AuthControllerService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.localStorageService.getData('user'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  saveAndSetUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  public localLogin(credentials: LoginRequest) {
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
    const accessToken = authResponse.accessToken!;
    const user = parseUserFromJwt(accessToken);
    const authenticatedUser = {...user, accessToken} as User;
    this.localStorageService.saveData('user', authenticatedUser);
    this.currentUserSubject.next(authenticatedUser);  // Update the BehaviorSubject
  }

  public signup(signupDTO: SignUpRequest) {
    this.authController.signUp(signupDTO).subscribe({
      next: authResponse => {
        this.handleAuthorization(authResponse);
        this.eventService.notify('Registration of new user was successful!', 'success');
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
    const parsedUser = JSON.parse(user) as User,
      jwtPayload = JSON.parse(window.atob(parsedUser.accessToken!.split('.')[1])),
      isExpired = Date.now() >= jwtPayload.exp * 1000;
    if (isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

}
