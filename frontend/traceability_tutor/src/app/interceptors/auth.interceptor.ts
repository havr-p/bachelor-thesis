import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, firstValueFrom, map, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AUTH_TOKEN} from "../services/local-storage/local-storage.service";
import {UserDTO} from "../../../gen/model";
import {StateManager} from "../models/state";
import {AuthService} from "../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("LOG in interceptor");
    if (this.authService.isAuthenticated()) {
      console.log("adding token")
      request = request.clone({
        setHeaders: {
          Authorization: this.bearerAuth()
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleErrorRes(error))
    );
  }



  private handleErrorRes(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.router.navigateByUrl("/auth", {replaceUrl: true});
    }
    return throwError(() => error);
  }
  private bearerAuth() {
    const accessToken = this.authService.currentUser
      .pipe(map(value => value?.accessToken));
    return `Bearer ${firstValueFrom(accessToken)}`
  }
}
