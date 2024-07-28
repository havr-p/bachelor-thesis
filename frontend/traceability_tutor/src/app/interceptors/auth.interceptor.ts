import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, map, Observable, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from "../services/auth/auth.service";
import {EventService} from "../services/event/event.service";
import {EditorEventType} from "../types";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService, private eventService: EventService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isAuthenticated()) {

            return this.bearerAuth().pipe(
                switchMap(authHeader => {
                    request = request.clone({
                        setHeaders: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json',
                            Authorization: authHeader
                        }
                    });
                    return next.handle(request);
                }),
                catchError((error: HttpErrorResponse) => this.handleErrorRes(error))
            );
        } else {
            return next.handle(request);
        }
    }


    private handleErrorRes(error: HttpErrorResponse): Observable<never> {
        console.log("error in auth interceptor", error)
        if (error.status === 401) {
            this.authService.logout();
        } else if (error.status === 500 && error.url?.includes("codeItems")) {
          this.eventService.notify("Please check whether GitHub access token is set correctly", 'error');
          //this.eventService.publishEditorEvent(EditorEventType.OPEN_SETTINGS, 'tokenCorrection');
        }
        return throwError(() => error);
    }

    private bearerAuth(): Observable<string> {
        return this.authService.currentUser.pipe(
            map(value => `Bearer ${value?.accessToken || ''}`)
        );
    }
}
