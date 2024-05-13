/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type {HttpContext, HttpHeaders, HttpParams} from '@angular/common/http'
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import type {CredentialsDTO, SignUpDTO, UserDTO} from '../model'


type HttpClientOptions = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: any;
  withCredentials?: boolean;
};


@Injectable({providedIn: 'root'})
export class AuthControllerService {
  constructor(
    private http: HttpClient,
  ) {
  }

  register<TData = UserDTO>(
    signUpDTO: SignUpDTO, options?: HttpClientOptions
  ): Observable<TData> {
    return this.http.post<TData>(
      `/api/signup`,
      signUpDTO, options
    );
  }

  login<TData = UserDTO>(
    credentialsDTO: CredentialsDTO, options?: HttpClientOptions
  ): Observable<TData> {
    return this.http.post<TData>(
      `/api/login`,
      credentialsDTO, options
    );
  }


}

export type RegisterClientResult = NonNullable<UserDTO>
export type LoginClientResult = NonNullable<UserDTO>
