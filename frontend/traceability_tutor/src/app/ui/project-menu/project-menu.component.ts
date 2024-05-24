import {Component, OnInit} from '@angular/core';
import {ProjectDTO} from "../../../../gen/model";
import {DataViewModule} from "primeng/dataview";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {CreateProjectFormComponent} from "../forms/create-project.form/create-project.form.component";
import {DialogModule} from "primeng/dialog";
import {DockComponent} from "../dock/dock.component";
import {EventService} from "../../services/event/event.service";
import {BaseEvent, EventSource, ProjectEventType} from "../../types";
import {AuthService} from "../../services/auth/auth.service";
import {of, switchMap} from "rxjs";
import {NavigationService} from "../../services/navigation.service";
import {OrderListModule} from "primeng/orderlist";
import {RouterLink} from "@angular/router";

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
        DatePipe,
        OrderListModule,
        RouterLink
    ],
    standalone: true
})
export class ProjectMenuComponent implements OnInit {

    projects: ProjectDTO[] = [];
    createNewProjectDialogVisible = false;

    constructor(private projectService: ProjectResourceService,
                private eventService: EventService,
                private authService: AuthService,
                private navigationService: NavigationService) {
    }

    ngOnInit(): void {
        console.log(this.authService.currentUserValue);
        this.fetchUserProjects();
        this.eventService.event$.subscribe(
            async (event: BaseEvent<EventSource, ProjectEventType>) => {
                if (event.source === EventSource.PROJECT_MENU) {
                    switch (event.type) {
                        case ProjectEventType.CREATE:
                            this.createNewProjectDialogVisible = true;
                            break;
                        case ProjectEventType.SETUP_DEMO:
                            this.setupDemo();
                            break;
                    }
                }

            });
    }

    openProject(project: ProjectDTO) {
        this.projectService.updateLastOpened(project.id!).subscribe({
            next: value => {
                console.log('update last opened', value)
            },
            error: err => {
                console.log(err)
            }
        });
        //   .subscribe((projectId => {
        //   let project = this.projects.find(p => p.id === projectId);
        //   project?.lastOpened
        // }))
        this.navigationService.navigateToEditor(project.id!);
    }

    private fetchUserProjects() {
        this.authService.currentUser.pipe(
            switchMap(user => user ? this.projectService.getUserProjects(user.id!) : of([]))
        ).subscribe(projects => {
            this.projects = projects;
        });
    }

    private setupDemo() {
        this.projectService.setupDemoProject().subscribe({
                next: projectId => {
                    console.log("Demo project created with id " + projectId);
                    this.fetchUserProjects();
                    this.navigationService.navigateToProjectMenu();
                    this.eventService.notify("Your demo project was created! You can now access it via project menu.", 'success');
                },
                error: err => {
                    this.eventService.notify("Error occured during demo project creation: <br>" + err.error.message, 'error');
                }
            }
        )
    }
}
