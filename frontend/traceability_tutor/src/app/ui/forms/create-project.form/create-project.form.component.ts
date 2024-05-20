import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {EventService} from "../../../services/event/event.service";
import {ProjectResourceService} from "../../../../../gen/services/project-resource";
import {StateManager} from "../../../models/state";
import {AuthService} from "../../../services/auth/auth.service";
import {NavigationService} from "../../../services/navigation.service";
import {LevelListComponent} from "./level-list/level-list.component";

@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project.form.component.html',
  styleUrl: './create-project.form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, LevelListComponent]
})
  export class CreateProjectFormComponent {
    projectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      repoUrl: new FormControl('', [Validators.required]),
      repoAccessToken: new FormControl('', [Validators.required, ]),
    });

    constructor(private eventService: EventService,
                private projectService: ProjectResourceService,
                private stateManager: StateManager,
                private authService: AuthService,
                private navigationService: NavigationService) {
    }

    onSubmit() {

      if (!this.authService.isAuthenticated()) {
        this.eventService.notify("Please log in to create a project", 'error');
        return;
      }

      console.log('Form Submitted!', this.projectForm.value);
      if (this.projectForm.valid) {
        this.projectService.createProject({
          owner: this.authService.currentUserValue?.id!,
          repoUrl: this.projectForm.value.repoUrl!,
          name: this.projectForm.value.name!
        }).subscribe({
          next: (projectId) => {
            this.eventService.notify("Project was created successfully", 'success');
            this.navigationService.navigateToEditor(projectId);
          },
          error: (error) => {
            this.eventService.notify("Failed to create project: " + error.message, 'error');
          }
        });
      }
    }
}
