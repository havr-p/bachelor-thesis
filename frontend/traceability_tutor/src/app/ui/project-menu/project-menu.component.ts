import {Component, OnInit} from '@angular/core';
import {ProjectDTO} from "../../../../gen/model";
import {DataViewModule} from "primeng/dataview";
import {NgClass, NgForOf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StateManager} from "../../models/state";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {CreateProjectFormComponent} from "../forms/create-project.form/create-project.form.component";
import {DialogModule} from "primeng/dialog";
import {DockComponent} from "../dock/dock.component";
import {EventService} from "../../services/event/event.service";
import {BaseEvent, EditorEventType, EventSource, ProjectEventType} from "../../types";

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
    DockComponent
  ],
  standalone: true
})
export class ProjectMenuComponent implements OnInit {

  constructor(private stateManager: StateManager, private localStorageService: LocalStorageService, private projectService: ProjectResourceService, private eventService: EventService) {
  }

  projects: ProjectDTO[] = [];
  createNewProjectDialogVisible = false;



  ngOnInit(): void {
    if (this.stateManager.currentUser)
    this.projectService.getUserProjects(this.stateManager.currentUser.id).subscribe(projects => {
      this.projects = projects;
    });
    console.log(this.projects)
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

}
