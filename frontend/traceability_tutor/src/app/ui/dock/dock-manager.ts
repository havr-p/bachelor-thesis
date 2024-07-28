import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventService } from '../../services/event/event.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { StateManager } from '../../models/state';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import { EditorEventType, ProjectEventType } from '../../types';
import { ProjectResourceService } from '../../../../gen/services/project-resource';
import { ItemType } from '../../../../gen/model';

export type DockMode = 'projects' | 'releases' | 'editor' | 'editor-release';

@Injectable({
  providedIn: 'root'
})
export class DockManager {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  menuItems$ = this.menuItemsSubject.asObservable();

  constructor(
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private stateManager: StateManager,
    private projectService: ProjectResourceService
  ) {
    // Initialize with default menu items
    const initialItems = this.buildMenuItems('editor'); // Default mode
    this.menuItemsSubject.next(initialItems);
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
          label: 'Item',
          items: [
            {
              label: 'New...',
              items: [
                {
                  label: 'Requirement',
                  tooltip: 'Use this command to create a new requirement node',
                  tooltipPosition: 'bottom',
                  command: async () => {
                    const data = ItemType.REQUIREMENT
                    this.eventService.publishEditorEvent(EditorEventType.ADD_ITEM, data);
                  },
                },
                {
                  label: 'Code item',
                  tooltip: 'Use this command to add code item',
                  tooltipPosition: 'bottom',
                  command: async () => {
                    const data = ItemType.CODE
                    this.eventService.publishEditorEvent(EditorEventType.ADD_ITEM, data);
                  },
                },
              ]
            },
          ],
        },
        {
          label: 'Relationship',
          items: [
            {
              label: 'Add',
              command: async () => {
                this.eventService.publishEditorEvent(EditorEventType.ADD_RELATIONSHIP);
              },
            }
          ],
        },
        {
          label: 'Iterations',
          items: [
            {
              label: 'Save as iteration',
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.SAVE_ITERATION);
              },

            },
            {
              label: 'View iterations',
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.VIEW_ITERATIONS);
              },

            },
          ],
        },
        {
          label: 'Data',
          items: [
            {
              label: 'Clear editor',
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.CLEAR);
              },
            },
            {
              label: 'Import',
              disabled: true,
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.IMPORT);
              },
            },
            {
              label: 'Export',
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.EXPORT);
              },
            },
            {
              label: 'Fetch code items',
              tooltip: 'Use this command to fetch code items',
              tooltipPosition: 'bottom',
              command: async () => {
                const data = {projectId: this.stateManager.currentProject?.id}
                this.eventService.publishEditorEvent(EditorEventType.FETCH_CODE, data);
              },
            },
          ],
        },
        {
          label: 'View',
          items: [
            {
              label: 'Rearrange items',
              command: () => {
                this.eventService.publishEditorEvent(EditorEventType.REARRANGE)
              }
            }
          ]
        },
        {
          label: 'Projects menu',
          routerLink: '/projects',
        },
        {label: 'Settings',
          command: () => {
            this.eventService.publishEditorEvent(EditorEventType.OPEN_SETTINGS);
          }},

      ];
    } else if (mode === 'projects') {
      items = [
        {
          label: 'New Project',
          command: () => {
            this.eventService.publishProjectMenuEvent(ProjectEventType.CREATE);
          }
        },
        {
          label: 'Setup demo project',
          command: () => {
            this.eventService.publishProjectMenuEvent(ProjectEventType.SETUP_DEMO);
          }
        }
      ];
    }
    return items;
  }

  /**
   * Update the menu items based on the mode.
   * @param mode Mode of the application
   */
  updateMenuItems(mode: DockMode) {
    const items = this.buildMenuItems(mode);
    this.menuItemsSubject.next(items);
  }

  /**
   * Add a new menu item.
   * @param item The `MenuItem` to add
   */
  addMenuItem(item: MenuItem) {
    const currentItems = this.menuItemsSubject.getValue();
    this.menuItemsSubject.next([...currentItems, item]);
  }

  /**
   * Remove a menu item.
   * @param label The label of the `MenuItem` to remove
   */
  removeMenuItem(label: string) {
    const currentItems = this.menuItemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.label !== label);
    this.menuItemsSubject.next(updatedItems);
  }
}
