import {RequirementsService} from "../../services/requirements/requirements.service";
import {EventService} from "../../services/event/event.service";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {StateManager} from "../../models/state";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {EditorEventType, ProjectEventType} from "../../types";
import {Requirement} from "../../models/requirement";
import {Injectable} from "@angular/core";
import {ProjectResourceService} from "../../../../gen/services/project-resource";

export type DockMode = 'projects' | 'releases' | 'editor' | 'editor-release'

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
  buildMenuItems(mode: DockMode): MenuItem[] {
    let items: MenuItem[] = [];

    if (mode === 'editor') {
      items = [
        {
          label: 'Add node',
          styleClass: 'menuItem',
          items: [
            {
              label: 'Requirement',
              tooltip: 'Use this command to create a new requirement node',
              tooltipPosition: 'bottom',
              command: async () => {
                const data = undefined;
                this.eventService.publishEditorEvent(EditorEventType.ADD, data);
              },
            },
          ],
        },
        {
          label: 'Iteration',
          items: [
            {
              label: 'Save as iteration',
              command: () => {
                console.log("Save iteration");
                this.eventService.publishEditorEvent(EditorEventType.SAVE_ITERATION)
              },
            },
          ],

        },
        {
          label: 'Clear editor',
          command: () => {
            this.localStorageService.clearData();
            this.eventService.publishEditorEvent(EditorEventType.CLEAR);
          },
        },
        {
          label: 'Projects menu',
          routerLink: '/projects',
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
        {
          label: 'Setup demo project',
          command: () => {
            this.eventService.publishProjectMenuEvent(ProjectEventType.SETUP_DEMO)
          }
        }
      ]
    }
    return items;
  }

}
