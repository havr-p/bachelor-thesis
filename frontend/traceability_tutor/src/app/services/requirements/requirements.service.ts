import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Requirement} from '../../models/requirement';
import {HttpResponse} from 'msw';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequirementsService {
  constructor(private http: HttpClient) {
  }

  async fetchRequirements(): Promise<Requirement[]> {
    const response = await fetch(`${environment.apiUrl}/requirements/all`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

  updateRequirement(requirement: any) {
    console.log('i will save', requirement);
    //this.http.post();
    return new HttpResponse(null, {
      status: 200,
      statusText: 'ok',
    });
  }
}
