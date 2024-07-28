/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * traceability-tutor
 */
import {
  HttpClient
} from '@angular/common/http'
import type {
  HttpContext,
  HttpHeaders,
  HttpParams
} from '@angular/common/http'
import {
  Injectable
} from '@angular/core'
import {
  Observable
} from 'rxjs'
import type {
  CreateRelationshipDTO,
  RelationshipDTO
} from '../model'



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



@Injectable({ providedIn: 'root' })
export class RelationshipResourceService {
  constructor(
    private http: HttpClient,
  ) {} getRelationship<TData = RelationshipDTO>(
    id: number, options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.get<TData>(
      `/api/relationships/${id}`,options
    );
  }
 updateRelationship<TData = RelationshipDTO>(
    id: number,
    relationshipDTO: RelationshipDTO, options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.put<TData>(
      `/api/relationships/${id}`,
      relationshipDTO,options
    );
  }
 deleteRelationship<TData = void>(
    id: number, options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.delete<TData>(
      `/api/relationships/${id}`,options
    );
  }
 getAllRelationships<TData = RelationshipDTO[]>(
     options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.get<TData>(
      `/api/relationships`,options
    );
  }
 createRelationship<TData = RelationshipDTO>(
    createRelationshipDTO: CreateRelationshipDTO, options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.post<TData>(
      `/api/relationships`,
      createRelationshipDTO,options
    );
  }
 getProjectEditableRelationships<TData = RelationshipDTO[]>(
    id: number, options?: HttpClientOptions
  ): Observable<TData>  {
    return this.http.get<TData>(
      `/api/relationships/project/${id}`,options
    );
  }
};

export type GetRelationshipClientResult = NonNullable<RelationshipDTO>
export type UpdateRelationshipClientResult = NonNullable<RelationshipDTO>
export type DeleteRelationshipClientResult = NonNullable<void>
export type GetAllRelationshipsClientResult = NonNullable<RelationshipDTO[]>
export type CreateRelationshipClientResult = NonNullable<RelationshipDTO>
export type GetProjectEditableRelationshipsClientResult = NonNullable<RelationshipDTO[]>
