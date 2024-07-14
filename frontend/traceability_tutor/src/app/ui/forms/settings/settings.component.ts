import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {lastValueFrom} from "rxjs";

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
    InputMaskModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnChanges{

  constructor(private projectService: ProjectResourceService, private state: StateManager) {
  }
  @Input() projectId = 0;
  projectSettings!: ProjectSettings;

  settingsForm = new FormBuilder().group({
    name: ['', [Validators.required]],
    repoName: ['', [Validators.required]],
    accessToken: ['', [Validators.required]]
  });




  submitForm() {
    if (this.settingsForm.valid) {
      const formValue: NonNullable<ProjectSettings> = this.settingsForm.getRawValue() as NonNullable<ProjectSettings>
      this.projectService.updateProjectSettings(this.projectId, formValue);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.projectId) {
      this.projectId = this.state.currentProject?.id!;
      this.projectSettings = await lastValueFrom(this.projectService.getProjectSettings(this.projectId));
    }
  }
}
