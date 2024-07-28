import {NodeEditor} from "rete";
import {Schemes} from "../../types";
import {structures} from "rete-structures";
import {ValidationService} from "./validation.service";
import {ValidationResourceService} from "../../../../gen/services/validation-resource";

export class EditValidator {
  private readonly editor: NodeEditor<Schemes>

  constructor(editor: NodeEditor<Schemes>, private validationService: ValidationResourceService) {
    this.editor = editor;
  }

  validateItemEdition(itemId: string) {
    const graph = structures(this.editor);
  }
}
