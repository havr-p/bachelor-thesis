import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputMaskModule} from "primeng/inputmask";
import {ProjectSettings} from "../../../../../gen/model";
import {StateManager} from "../../../models/state";
import {ProjectResourceService} from "../../../../../gen/services/project-resource";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    InputMaskModule,
    DialogModule
  ],
  template: `
    <p-dialog [(visible)]="isVisible"
              [style]="{ width: '900px' }"
              [header]="'Project settings'"
              [closable]="true"
              [draggable]="true"
              [resizable]="true">
      <form [formGroup]="settingsForm" (ngSubmit)="submitForm()" class="app-form">
        <div class="form-field">
          <label for="name">Name</label>
          <input id="name" formControlName="name" pInputText />
        </div>
        <div class="form-field">
          <label for="repoName">Repository name</label>
          <input id="repoName" formControlName="repoName" pInputText />
        </div>
        <div class="form-field">
          <label for="accessToken">VCS token</label>
          <input id="accessToken" formControlName="accessToken" pInputText />
        </div>
        <p-button label="Save" type="submit" [disabled]="settingsForm.invalid"></p-button>
      </form>
    </p-dialog>
  `,
})
export class SettingsComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  isVisible = false;

  projectSettings!: ProjectSettings;
  projectId = 0;

  settingsForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    repoName: ['', [Validators.required]],
    accessToken: ['', [Validators.required]]
  });

  constructor(
      private formBuilder: FormBuilder,
      private projectService: ProjectResourceService,
      private state: StateManager
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue !== this.isVisible) {
      this.isVisible = this.visible;
      if (this.isVisible) {
        this.loadProjectSettings();
      }
    }
  }

  private loadProjectSettings() {
    this.projectId = this.state.currentProject?.id!;
    this.projectService.getProjectSettings(this.projectId).subscribe({
      next: (value) => {
        this.projectSettings = value;
        this.settingsForm.patchValue(value);
      }
    });
  }

  submitForm() {
    if (this.settingsForm.valid) {
      const formValue = this.settingsForm.getRawValue() as NonNullable<ProjectSettings>;
      this.projectService.updateProjectSettings(this.projectId, formValue).subscribe({
        next: () => {
          this.closeDialog();
        }
      });
    }
  }

  private closeDialog() {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.settingsForm.reset();
  }
}
