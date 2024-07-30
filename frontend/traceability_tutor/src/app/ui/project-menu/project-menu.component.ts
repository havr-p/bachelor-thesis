import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContentsDTO, ProjectDTO} from "../../../../gen/model";
import {DataViewModule} from "primeng/dataview";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {CreateProjectFormComponent} from "../forms/create-project.form/create-project.form.component";
import {DialogModule} from "primeng/dialog";
import {DockComponent} from "../dock/dock.component";
import {EventService} from "../../services/event/event.service";
import {BaseEvent, EventSource, ProjectEventType} from "../../types";
import {AuthService} from "../../services/auth/auth.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
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
        RouterLink,
        NgIf
    ],
    standalone: true
})
export class ProjectMenuComponent implements OnInit, OnDestroy {

    projects: ProjectDTO[] = [];
    createNewProjectDialogVisible = false;
  private destroy$ = new Subject<void>();

    @ViewChild('fileInput') fileInput!: ElementRef;

    constructor(private projectService: ProjectResourceService,
                private eventService: EventService,
                private authService: AuthService,
                private navigationService: NavigationService) {
    }

    ngOnInit(): void {
        this.fetchUserProjects();
        this.eventService.event$.pipe(
          takeUntil(this.destroy$)
        ).subscribe(
            async (event: BaseEvent<EventSource, ProjectEventType>) => {
                if (event.source === EventSource.PROJECT_MENU) {
                    switch (event.type) {
                        case ProjectEventType.CREATE:
                            this.createNewProjectDialogVisible = true;
                            break;
                        case ProjectEventType.SETUP_DEMO:
                            this.setupDemo();
                            break;
                        case ProjectEventType.CREATE_FROM_FILE:
                            this.createNewProjectFromFile();
                    }
                }

            });
    }

    openProject(project: ProjectDTO) {
        this.projectService.updateLastOpened(project.id!).subscribe({
            next: value => {
            },
            error: err => {
                console.log(err)
            }
        });
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
                    //console.log("Demo project created with id " + projectId);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    private createNewProjectFromFile() {
        this.fileInput.nativeElement.click();
    }

    async onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.projectService.createFromFile(await file.text()).subscribe(
                {
                    next: async value => {
                        this.navigationService.navigateToProjectMenu();
                        this.fetchUserProjects();
                        this.eventService.notify("Your new project was created from file. You can now access it via project menu.", 'success');
                    },
                    error: err => {
                        this.eventService.notify("Error occured while creating project from file: <br>" + err.error.message, 'error');
                    }
                });
        }
    }
}
