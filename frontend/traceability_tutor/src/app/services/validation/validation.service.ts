import { Injectable } from '@angular/core';
import { Requirement } from '../../models/requirement';
import {Item} from "../../items/Item";
import {RelationshipType} from "../../../../gen/model";

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  validateRequirement(requirement: Requirement) {
    return true;
  }

  isValidConnection(fromItem: Item, toItem: Item, relationshipType: RelationshipType): boolean {
    return true;
  }

  doesCreateCycle(fromItem: Item, toItem: Item): boolean {
    // Проверка на создание цикла
    return false;
  }

  validateRequirementEdits(requirement: Requirement, updates: any): string[] {
    // Валидация изменений в требованиях
    return [];
  }
  validateItemEdits(item: Item, updates: any): string[] {
    // Валидация изменений в требованиях
    return [];
  }
}
