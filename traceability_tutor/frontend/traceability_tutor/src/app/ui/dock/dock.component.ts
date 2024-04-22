import { Component, OnInit } from '@angular/core';
import { FileUploadEvent } from 'primeng/fileupload';
import { Requirement } from '../../models/requirement';
import { EditorEventType } from '../../types';
import { RequirementsService } from '../../services/requirements/requirements.service';
import { EventService } from '../../services/event/event.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss',
})
export class DockComponent implements OnInit {
  menubarItems: any[] | undefined;
  id = 1;

  constructor(
    private requirementsService: RequirementsService,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
  ) {}
  ngOnInit() {
    this.menubarItems = [
      {
        label: 'Project',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'New...',
            icon: 'pi pi-fw pi-video',
            command: () => {
              this.loadAll();
            },
          },
        ],
      },
      {
        label: 'Load demo project',
        icon: 'pi pi-fw pi-video',
        command: async () => {
          let data = await this.loadAll();
          this.eventService.publishEditorEvent(EditorEventType.DEMO, data);
        },
      },
      {
        label: 'Add node',
        icon: 'pi pi-fw pi-trash',
        items: [
          {
            label: 'Requirement',
            tooltip: 'Use this command to create a new requirement node',
            tooltipPosition: 'bottom',
            command: async () => {
              console.log('called');
              let data: Requirement = {
                id: Number(this.id++).toString(),
                level: 'stakeholder',
                name: 'New Requirement',
                statement: 'New Requirement Description',
                references: [],
                mid: Number(this.id++).toString(),
              };
              this.eventService.publishEditorEvent(EditorEventType.ADD, data);
            },
          },
        ],
      },

      {
        label: 'Clear',
        command: () => {
          this.localStorageService.clearData();
          this.eventService.publishEditorEvent(EditorEventType.CLEAR);
        },
      },
    ];
  }

  protected readonly Date = Date;
  createNewProjectDialogVisible = false;
  uploadedFiles: any;
  value: any;

  private createNewProject() {}

  onUpload($event: FileUploadEvent) {}

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
