import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Requirement} from '../../models/requirement';
import {HttpResponse} from 'msw';
import {HttpClient} from '@angular/common/http';
import * as demoRequirements from '../../../assets/tt-reqs.json'
@Injectable({
  providedIn: 'root',
})
export class RequirementsService {
  constructor(private http: HttpClient) {
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
