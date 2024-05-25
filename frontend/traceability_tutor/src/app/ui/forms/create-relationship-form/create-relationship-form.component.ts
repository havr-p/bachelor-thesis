import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import {defer, lastValueFrom, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {CreateRelationshipDTO, RelationshipDTO, RelationshipType} from "../../../../../gen/model";
import {EditorService} from "../../../services/editor/editor.service";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {EventService} from "../../../services/event/event.service";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-create-relationship-form',
  templateUrl: './create-relationship-form.component.html',
  styleUrls: ['./create-relationship-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    NgIf,
    InputTextareaModule,
    InputTextModule
  ],
  standalone: true
})
export class CreateRelationshipFormComponent implements OnChanges {
  @Input() createRelationshipPair: { startItem: string; endItem: string } | undefined;
  @Output() onRelationshipCreation = new EventEmitter<boolean>();

  relationshipForm: FormGroup;
  relationshipTypes = Object.values(RelationshipType);

  constructor(private fb: FormBuilder, private editorService: EditorService, private eventService: EventService) {
    this.relationshipForm = this.fb.group({
      startItem: [{ value: '', disabled: true }, [Validators.required]],
      endItem: [{ value: '', disabled: true }, [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.maxLength(255)]]
    }, {
      asyncValidators: [this.notCreatingCycleValidator()]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['createRelationshipPair'] && this.createRelationshipPair) {
      this.relationshipForm.patchValue({
        startItem: this.createRelationshipPair.startItem,
        endItem: this.createRelationshipPair.endItem
      });
    }
  }

  notCreatingCycleValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const endItem = control.get('endItem')?.value;
      const startItem = control.get('startItem')?.value;

      if (startItem == null || endItem == null) {
        return new Observable<null>((observer) => {
          observer.next(null);
          observer.complete();
        });
      }

      return defer(() => this.editorService.notCreateCycle(startItem, endItem).then(
          isValid => (isValid ? null : { notCreatingCycle: true })
      ));
    };
  }

  createRelationship() {
    if (this.relationshipForm.valid) {
      const formValue = this.relationshipForm.getRawValue();
      const createRelationshipDTO: CreateRelationshipDTO = {
        startItem: formValue.startItem,
        endItem: formValue.endItem,
        type: formValue.type,
        description: formValue.description
      };
      this.editorService.addConnectionToEditorAndServer(createRelationshipDTO).then(
        () => {
          this.relationshipForm.reset();
          this.eventService.notify('Relationship was created successfully.', 'success');
          this.onRelationshipCreation.emit(true);
        }
      )
    }
  }
}
