import {Component, Input, OnInit} from '@angular/core';
import {FileUploadEvent} from 'primeng/fileupload';
import {Requirement} from '../../models/requirement';
import {RequirementsService} from '../../services/requirements/requirements.service';
import {EventService} from '../../services/event/event.service';
import {LocalStorageService} from '../../services/local-storage/local-storage.service';
import {StateManager} from "../../models/state";
import {MenubarModule} from "primeng/menubar";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss',
  imports: [
    MenubarModule,
    MenuModule,
    ButtonModule
  ],
  standalone: true
})
export class DockComponent implements OnInit {
  @Input() items: MenuItem[] | undefined;
  id = 1;

  userMenuItems: MenuItem[] = [
    {
      label: 'Options',
      style: {left: 'auto', right: 0, position: 'absolute'},
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh'
        },
        {
          label: 'Export',
          icon: 'pi pi-upload'
        }
      ]
    }
  ];

  constructor(
    private requirementsService: RequirementsService,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private stateManager: StateManager,
  ) {
  }

  ngOnInit() {
    //fixme we need to get rid of that completely
    // @ts-ignore
    // this.items = [
    //   {
    //     label: 'Project',
    //     items: [
    //       {
    //         label: 'New...',
    //         command: () => {
    //           this.createNewProjectDialogVisible = true;
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Load demo project',
    //     command: async () => {
    //       let data = await this.loadAll();
    //       this.eventService.publishEditorEvent(EditorEventType.DEMO, data);
    //     },
    //   },
    //   {
    //     label: 'Add node',
    //     styleClass: 'menuItem',
    //     items: [
    //       {
    //         label: 'Requirement',
    //         tooltip: 'Use this command to create a new requirement node',
    //         tooltipPosition: 'bottom',
    //         command: async () => {
    //           console.log('called');
    //           let data: Requirement = {
    //             id: Number(this.id++).toString(),
    //             level: 'stakeholder',
    //             name: 'New Requirement',
    //             statement: 'New Requirement Description',
    //           };
    //           this.eventService.publishEditorEvent(EditorEventType.ADD, data);
    //         },
    //       },
    //     ],
    //   },
    //
    //   {
    //     label: 'Clear',
    //     command: () => {
    //       this.localStorageService.clearData();
    //       this.eventService.publishEditorEvent(EditorEventType.CLEAR);
    //     },
    //   },
    //   {
    //     label: 'Logout',
    //     command: () => {
    //       this.stateManager.logout()
    //     }
    //   }
    // ];
    this.items?.push(...this.userMenuItems);

  }

  protected readonly Date = Date;
  createNewProjectDialogVisible = false;
  uploadedFiles: any;
  value: any;

  private createNewProject() {
  }

  onUpload($event: FileUploadEvent) {
  }

  private async loadAll(): Promise<Requirement[]> {
    try {
      const requirements = await this.requirementsService.fetchRequirements();
      return requirements;
    } catch (error) {
      console.error('Error fetching requirements:', error);
      return [];
    }
  }
}
