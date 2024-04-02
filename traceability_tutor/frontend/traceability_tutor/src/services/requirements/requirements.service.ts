import { Injectable } from '@angular/core';
import { Requirement } from '../../app/models/requirement';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequirementsService {
  constructor() {}
  async fetchRequirements(): Promise<Requirement[]> {
    const response = await fetch(`${environment.apiUrl}/requirements/all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }
}
