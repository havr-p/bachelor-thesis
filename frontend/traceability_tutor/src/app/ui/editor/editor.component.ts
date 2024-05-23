import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild,} from '@angular/core';

import {AutoArrangePlugin, Presets as ArrangePresets,} from 'rete-auto-arrange-plugin';

import {ClassicPreset, NodeEditor} from 'rete';
import {AreaExtensions} from 'rete-area-plugin';
import {BaseEvent, EditorEventType, EventSource, Schemes,} from '../../types';
import {MenuItem} from 'primeng/api';
import {RequirementItem} from '../../items/requirement-item';
import {EventService} from 'src/app/services/event/event.service';
import {LocalStorageService} from '../../services/local-storage/local-storage.service';
import {Item} from '../../items/Item';
import {StateManager} from "../../models/state";
import {AuthService} from "../../services/auth/auth.service";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {ActivatedRoute, Router} from "@angular/router";
import {createEditor} from "./create-editor";
import {lastValueFrom, map, switchMap} from "rxjs";
import {ItemDTO, ItemType, ProjectDTO, ReleaseDTO} from "../../../../gen/model";
import {Project} from "../../models/project";
import {Release} from "../../models/release";
import {ReleaseResourceService} from "../../../../gen/services/release-resource";
import {ItemResourceService} from "../../../../gen/services/item-resource";
import {mapGenericModel} from "../../models/itemMapper";

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
    private router: Router,
    private itemService: ItemResourceService,
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
        console.log("projectId", projectId)
        this.loadProjectEditableItems(projectId);
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
            case EditorEventType.TO_PROJECTS_MENU:
              await this.router.navigateByUrl('/projects');
              break;
          }
        }
      },
    );
  }

  private loadProjectEditableItems(projectId: number) {
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
          }),
          switchMap((project: Project) => {
            console.log('Project loaded with releases', project);
            this.state.currentProject = project;
            return this.itemService.getProjectEditableItems(project.id).pipe(
              map((items: ItemDTO[]) => ({ project, items }))
            );
          })
        );
      })
    ).subscribe({
      next: ({ project, items }) => {
        console.log('Project with editable items:', project, items);
        this.addItems(items).then(() => {
          console.log('Items added successfully');
        }).catch(error => {
          console.error('Failed to add items:', error);
        });
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


  ngOnDestroy(): void {
    if (this.destroyEditor) {
      this.destroyEditor();
    }
  }

  private async processDemoEvent(data: any) {
    console.log("demo event");
    console.log('demo data', data);
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

  private async addItems(items: ItemDTO[]) {
    for (const item of items) {
      const data = mapGenericModel(item);
    }
  }
}
