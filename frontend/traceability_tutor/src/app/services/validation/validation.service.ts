import {Injectable} from '@angular/core';
import {RelationshipType} from "../../../../gen/model";
import {Item} from "../../models/itemMapper";
import {GraphCycleValidator} from "./cycleValidation";
import {ValidateItemEditClientResult, ValidationResourceService} from "../../../../gen/services/validation-resource";
import {lastValueFrom} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ValidationService {

  private warningsEnabled = false
    constructor(private backendValidationService: ValidationResourceService) {
    }



    isValidConnection(fromItem: Item, toItem: Item, relationshipType: RelationshipType): boolean {
        return true;
    }

    doesCreateCycle(fromItem: Item, toItem: Item): boolean {
        return false;
    }


    async validateItemEdits(item: Item) {
      const res: ValidateItemEditClientResult = await lastValueFrom(this.backendValidationService.validateItemEdit(item.id));
      return res;
    }

    disableWarnings() {
    this.warningsEnabled = false;
    }

    enableWarnings() {
    this.warningsEnabled = true;
    }
}
