import { Injectable } from '@angular/core';
import { RequirementItem } from '../../items/requirement-item';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  validateRequirement(requirement: RequirementItem) {
    return true;
  }
}
