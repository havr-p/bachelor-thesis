import { Injectable } from '@angular/core';
import { Requirement } from '../../models/requirement';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  validateRequirement(requirement: Requirement) {
    return true;
  }
}
