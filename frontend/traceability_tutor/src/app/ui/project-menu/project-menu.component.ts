import {Component, OnInit} from '@angular/core';
import {ProjectDTO} from "../../../../gen/model";
import {DataViewModule} from "primeng/dataview";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StateManager} from "../../models/state";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {CreateProjectFormComponent} from "../forms/create-project.form/create-project.form.component";
import {DialogModule} from "primeng/dialog";
import {DockComponent} from "../dock/dock.component";
import {EventService} from "../../services/event/event.service";
import {BaseEvent, EditorEventType, EventSource, ProjectEventType} from "../../types";
import {AuthService} from "../../services/auth/auth.service";
import {of, switchMap} from "rxjs";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrl: './project-menu.component.scss',
  imports: [
    DataViewModule,
    NgClass,
    NgForOf,
    ButtonModule,
    CreateProjectFormComponent,
    DialogModule,
    DockComponent,
    DatePipe
  ],
  standalone: true
})
export class ProjectMenuComponent implements OnInit {

  constructor(private stateManager: StateManager,
              private localStorageService: LocalStorageService,
              private projectService: ProjectResourceService,
              private eventService: EventService,
              private authService: AuthService,
              private navigationService: NavigationService) {
  }

  projects: ProjectDTO[] = [];
  createNewProjectDialogVisible = false;



  ngOnInit(): void {
    console.log(this.authService.currentUserValue);
    this.authService.currentUser.pipe(
      // Ensure the user is defined before proceeding
      switchMap(user => user ? this.projectService.getUserProjects(user.id) : of([]))
    ).subscribe(projects => {
      this.projects = projects;
      console.log(this.projects); // This log will now reflect the updated projects array
    });
    this.eventService.event$.subscribe(
      async (event: BaseEvent<EventSource, ProjectEventType>) => {
        if (event.source === EventSource.PROJECT_MENU) {
          switch (event.type) {
            case ProjectEventType.CREATE:
              this.createNewProjectDialogVisible = true;
          }
        }

      });
  }

  openProject(project: ProjectDTO) {
    this.navigationService.navigateToEditor(project.id!);
  }
}
