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
import {githubTokenValidator} from "../../../utils";

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
    <p-dialog [(visible)]="visible"
              [style]="{ width: '900px' }"
              [header]="'Project settings'"
              [closable]="true"
              [draggable]="true"
              [resizable]="true"
              (onHide)="onDialogHide()"  >
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
          <small class="p-error" *ngIf="visible && settingsForm.controls['accessToken'].invalid">
            Please set correct GitHub access token.
          </small>
        </div>
        <p-button label="Save" type="submit" [disabled]="settingsForm.invalid"></p-button>
      </form>
    </p-dialog>
  `,
})
export class SettingsComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();


  projectSettings!: ProjectSettings;
  projectId = 0;


  settingsForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    repoName: ['', [Validators.required]],
    accessToken: ['', [Validators.required, githubTokenValidator]]
  });

  constructor(
      private formBuilder: FormBuilder,
      private projectService: ProjectResourceService,
      private state: StateManager
  ) {}

  ngOnChanges(changes: SimpleChanges) {

      if (this.visible) {
        this.loadProjectSettings();
      }
  }

  private loadProjectSettings() {
    this.projectId = this.state.currentProject?.id!;
    // this.projectService.getProjectSettings(this.projectId).subscribe({
    //   next: (value) => {
    //     this.projectSettings = value;
    //     this.settingsForm.patchValue(value);
    //   }
    // });
    this.projectSettings = this.state.currentProjectSettings!;
    this.settingsForm.patchValue(this.projectSettings);
  }

  submitForm() {
    if (this.settingsForm.valid) {
      const formValue = this.settingsForm.getRawValue() as NonNullable<ProjectSettings>;
      this.projectService.updateProjectSettings(this.projectId, formValue).subscribe({
        next: () => {
          this.state.currentProjectSettings = formValue;
          this.closeDialog();
        }
      });
    }
  }

  private closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.settingsForm.reset();
  }

  onDialogHide() {
    this.closeDialog();
  }
}
