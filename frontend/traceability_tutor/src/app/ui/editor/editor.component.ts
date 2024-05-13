import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild,} from '@angular/core';

import {AutoArrangePlugin, Presets as ArrangePresets,} from 'rete-auto-arrange-plugin';
import {ContextMenuExtra, ContextMenuPlugin} from 'rete-context-menu-plugin';
import {MinimapExtra, MinimapPlugin} from 'rete-minimap-plugin';

import {ClassicPreset, GetSchemes, NodeEditor} from 'rete';
import {Area2D, AreaExtensions, AreaPlugin} from 'rete-area-plugin';
import {ConnectionPlugin, Presets as ConnectionPresets,} from 'rete-connection-plugin';

import {AngularArea2D, AngularPlugin, Presets as AngularPresets,} from 'rete-angular-plugin/17';

import {CustomSocketComponent} from '../../customization/custom-socket/custom-socket.component';
import {CustomConnectionComponent} from '../../customization/custom-connection/custom-connection.component';

import {addCustomBackground} from '../../customization/custom-background';
import {Requirement} from '../../models/requirement';
import {BaseEvent, EditorEventType, EventSource, ItemProps, Schemes,} from '../../types';
import {structures} from 'rete-structures';
import {Connection} from '../../connection';
import {MenuItem} from 'primeng/api';
import {RequirementItem} from '../../items/requirement-item';
import {RequirementItemComponent} from '../items/requirement-item/requirement-item.component';
import {EventService} from 'src/app/services/event/event.service';
import {LocalStorageService} from '../../services/local-storage/local-storage.service';
import {Item} from '../../items/Item';
import {getDOMSocketPosition} from 'rete-render-utils';
import {StateManager} from "../../models/state";
import {AuthService} from "../../services/auth/auth.service";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {ActivatedRoute} from "@angular/router";
import {createEditor} from "./create-editor";
import {map, switchMap} from "rxjs";
import {ProjectDTO, ReleaseDTO} from "../../../../gen/model";
import {Project} from "../../models/project";
import {Release} from "../../models/release";
import {ReleaseResourceService} from "../../../../gen/services/release-resource";

const socket = new ClassicPreset.Socket('socket');

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('rete') container!: ElementRef<HTMLElement>;
  destroyEditor: any;
  editor!: NodeEditor<Schemes>;
  area: any;
  arrange: any;
  sidebarVisible = false;
  openedItem!: Item;

  nodeActions: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        console.log('Edit');
      },
      tooltipOptions: {
        tooltipLabel: 'Edit node',
        tooltipPosition: 'bottom',
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        console.log('Delete');
      },
      tooltipOptions: {
        tooltipLabel: 'Delete node',
        tooltipPosition: 'bottom',
      },
    },
  ];
  //todo disable vertical scroll
  loading = false;

  onItemInfoViewToggleVisible(visible: boolean) {
    this.sidebarVisible = visible;
  }

  constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private state: StateManager,
    private authService: AuthService,
    private projectService: ProjectResourceService,
    private releaseService: ReleaseResourceService,
  ) {
  }

  async ngAfterViewInit() {
    const el = this.container.nativeElement;

    if (el) {
      this.loading = true;
      createEditor(el, this.injector, this.eventService).then(
        async ({destroy, editor, area}) => {
          this.destroyEditor = destroy;
          this.editor = editor;
          this.area = area;
          this.arrange = new AutoArrangePlugin<Schemes>();

          this.arrange.addPreset(ArrangePresets.classic.setup());

          this.area.use(this.arrange);

        },
      );
      this.loading = false;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('projectId'));
      if (projectId) {
        this.loadProject(projectId);
      } else {
        console.error('Project ID not found');
      }
    });



    this.eventService.event$.subscribe(
      async (event: BaseEvent<EventSource, EditorEventType>) => {
        if (event.source === EventSource.EDITOR) {
          switch (event.type) {
            case EditorEventType.DEMO:
              await this.processDemoEvent(event.data);
              break;
            case EditorEventType.ADD:
              await this.addNode(new RequirementItem(event.data));
              break;
            case EditorEventType.SELECT:
              console.log('selected', event.data);
              this.openedItem = event.data;
              this.sidebarVisible = true;
              break;
            case EditorEventType.CLEAR:
              await this.editor.clear();
              break;
          }
        }
      },
    );
  }

  private loadProject(projectId: number) {
    this.projectService.getProject(projectId).pipe(
      switchMap((projectDTO: ProjectDTO) => {
        const project = new Project(projectDTO);
        return this.releaseService.getAllReleases({ params: { projectId: projectId } }).pipe(
          map((releases: ReleaseDTO[]) => {
            releases.forEach(releaseDTO => {
              const release = new Release(releaseDTO);
              project.addRelease(release);
            });
            return project;
          })
        );
      })
    ).subscribe({
      next: (project) => {
        this.state.currentProject = project;
        console.log('Project loaded with releases', project);
      },
      error: (error) => {
        console.error('Failed to load project:', error);
      }
    });
  }



  async addNode(node: any) {
    node.addOutput(node.id, new ClassicPreset.Output(socket));
    node.addInput(node.id, new ClassicPreset.Input(socket));
    await this.editor.addNode(node);
  }

  get openedItemTitle(): string {
    if (this.openedItem) return this.openedItem.data.name;
    return 'item not defined';
  }

  ngOnDestroy(): void {
    if (this.destroyEditor) {
      this.destroyEditor();
    }
  }

  private async processDemoEvent(data: any) {
    console.log("demo event");
  }

  private async arrangeNodes() {
    this.arrange.addPreset(ArrangePresets.classic.setup());

    this.area.use(this.arrange);

    // for (let node of this.editor.getNodes()) {
    //   //console.log(node);
    //   if (node instanceof RequirementItem) {
    //     const parentRefs = node.data.references;
    //     for (const ref of parentRefs) {
    //       const parent = this.editor.getNode(ref.parentId);
    //       if (parent) {
    //         await this.editor.addConnection(
    //           new Connection(parent, parent.id, node, node.id),
    //         );
    //       }
    //     }
    //   }
    // }
    //fixme add connections with help of relationships
    await this.arrange.layout({
      options: {
        'elk.spacing.nodeNode': 200,
        'elk.layered.spacing.nodeNodeBetweenLayers': 200,
        'elk.alignment': 'RIGHT',
        'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS', //LINEAR_SEGMENTS, BRANDES_KOEPF
        //'elk.graphviz.concentrate': true,
        'elk.direction': 'RIGHT', //we want DOWN but need to configure sockets,
        'elk.edge.type': 'DIRECTED',
        //'elk.layered.wrapping.strategy': 'MULTI_EDGE',
        //'elk.layered.crossingMinimization.hierarchicalSweepiness': -1,
        'elk.radial.centerOnRoot': true,
        'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      },
    });
    await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
  }

}
