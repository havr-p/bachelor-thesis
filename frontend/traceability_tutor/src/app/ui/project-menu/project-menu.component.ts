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
import {MenuItem} from "primeng/api";

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

  constructor(private stateManager: StateManager, private localStorageService: LocalStorageService, private projectService: ProjectResourceService) {
  }

  projects: ProjectDTO[] = [];
  createNewProjectDialogVisible = false;
  dockItems: MenuItem[] = [];

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.projectService.getUserProjects().subscribe(projects => {
      this.projects = projects;
    });
    console.log(this.projects)
  }

}
