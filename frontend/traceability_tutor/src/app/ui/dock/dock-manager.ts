import {RequirementsService} from "../../services/requirements/requirements.service";
import {EventService} from "../../services/event/event.service";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {StateManager} from "../../models/state";
import {MenuItem} from "primeng/api";
import {EditorEventType, ProjectEventType} from "../../types";
import {Requirement} from "../../models/requirement";
import {Injectable} from "@angular/core";
import {ProjectResourceService} from "../../../../gen/services/project-resource";

@Injectable({
  providedIn: 'root'
})
export class DockManager  {
  constructor(
    private requirementsService: RequirementsService,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private stateManager: StateManager,
    private projectService: ProjectResourceService
  ) {
  }

  /**
   * Build a standard menu based on the current mode.
   * @param mode Mode of the application (e.g., 'projects', 'releases', 'editor')
   * @returns An array of `MenuItem` suitable for PrimeNG Menubar.
   */
  buildMenuItems(mode: 'projects' | 'releases' | 'editor'): MenuItem[] {
    let items: MenuItem[] = [];

    if (mode === 'editor') {
      items = [
        {
          label: 'Load demo project',
          command: async () => {
            const data = await this.loadAll();
            this.eventService.publishEditorEvent(EditorEventType.DEMO, data);
          },
        },
        {
          label: 'Add node',
          styleClass: 'menuItem',
          items: [
            {
              label: 'Requirement',
              tooltip: 'Use this command to create a new requirement node',
              tooltipPosition: 'bottom',
              command: async () => {
                const data: Requirement = {
                  id: '1',
                  level: 'stakeholder',
                  name: 'New Requirement',
                  statement: 'New Requirement Description',
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
    } else if (mode === 'projects') {
      console.log("projects mode")
      items = [
        {
          label: 'New Project',
          command: () => {
            this.eventService.publishProjectMenuEvent(ProjectEventType.CREATE)
          }
        },
      ]
    }
    return items;
  }

  private async loadAll(): Promise<Requirement[]> {
    try {
      return await this.requirementsService.fetchRequirements();
    } catch (error) {
      console.error('Error fetching requirements:', error);
      return [];
    }
  }
}
