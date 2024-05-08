import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProjectDTO} from "../../../../api/model";
import {DataViewModule} from "primeng/dataview";
import {NgClass, NgForOf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StateManager} from "../../models/state";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {GetUserProjectsClientResult, ProjectResourceService} from "../../../../api/services/project-resource";

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrl: './project-menu.component.scss',
  imports: [
    DataViewModule,
    NgClass,
    NgForOf,
    ButtonModule
  ],
  standalone: true
})
export class ProjectMenuComponent implements OnInit{

  constructor(private stateManager: StateManager, private localStorageService: LocalStorageService, private projectService: ProjectResourceService) {
  }

  projects: ProjectDTO[] = [];

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

}
