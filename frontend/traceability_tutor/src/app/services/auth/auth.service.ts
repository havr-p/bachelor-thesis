import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {UserDTO} from "../../../../gen/model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserDTO | null>;
  public currentUser: Observable<UserDTO | null>;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService // Assuming LocalStorageService is already implemented
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
