import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild,} from '@angular/core';

import {ClassicPreset, NodeEditor} from 'rete';
import {AreaExtensions} from 'rete-area-plugin';
import {BaseEvent, EditorEventType, EventSource, Schemes,} from '../../types';
import {ItemNode} from '../../items/item-node';
import {EventService} from 'src/app/services/event/event.service';
import {Item} from '../../items/Item';
import {StateManager} from "../../models/state";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {ActivatedRoute, Router} from "@angular/router";
import {createEditor, unselectAll} from "./create-editor";
import {concatMap, map, switchMap} from "rxjs";
import {ItemDTO, ProjectDTO, RelationshipDTO, ReleaseDTO} from "../../../../gen/model";
import {Project} from "../../models/project";
import {Release} from "../../models/release";
import {ReleaseResourceService} from "../../../../gen/services/release-resource";
import {ItemResourceService} from "../../../../gen/services/item-resource";
import {mapGenericModel} from "../../models/itemMapper";
import {Connection} from "../../connection";
import {RelationshipResourceService} from "../../../../gen/services/relationship-resource";
import {structures} from "rete-structures";
import {findSelf} from "./cycleValidation";

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
  //todo disable vertical scroll
  loading = false;

  onItemInfoViewToggleVisible(visible: boolean) {
    this.sidebarVisible = visible;
  }

  constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    private eventService: EventService,
    private state: StateManager,
    private projectService: ProjectResourceService,
    private releaseService: ReleaseResourceService,
    private router: Router,
    private itemService: ItemResourceService,
    private relationshipService: RelationshipResourceService,
  ) {
  }

  async ngAfterViewInit() {
    const el = this.container.nativeElement;
    if (el) {
      this.loading = true;
       await createEditor(el, this.injector, this.eventService).then(
         ({destroy, editor, area, arrange}) => {
          this.destroyEditor = destroy;
          this.editor = editor;
          this.area = area;
          this.arrange = arrange;
          this.loadProjectFromPath();
           this.applyPipes(editor);
         },
      );
      this.loading = false;
    }
  }

  private loadProjectFromPath() {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('projectId'));
      if (projectId) {
        console.log("projectId", projectId)
        console.log('editor', this.editor.getNodes());
        this.loadEditableItems(projectId).subscribe({
          next: async () => {
            this.loadEditableRelationships(projectId);
          }
        })
      } else {
        console.error('Project ID not found');
      }
    });
  }

  private applyPipes(editor: NodeEditor<Schemes>) {
    const graph = structures(editor);
    editor.addPipe((c) => {
      if (c.type === 'connectioncreate') {
        for (const node of graph.nodes()) {
          const found = findSelf(graph, node, graph.predecessors(node.id).nodes());
          if (found) {
            alert('Connection removed due to recursion');
            return;
          }
        }
      }
      return c;
    });
    this.area.addPipe((c: { type: string; }) => {
      if (c.type === 'pointerdown') {
        unselectAll(graph);
      }
      return c;
    });
  }

  ngOnInit(): void {
    this.eventService.event$.subscribe(
      async (event: BaseEvent<EventSource, EditorEventType>) => {
        if (event.source === EventSource.EDITOR) {
          switch (event.type) {
            case EditorEventType.DEMO:
              await this.processDemoEvent(event.data);
              break;
            case EditorEventType.ADD:
              await this.addNode(new ItemNode(event.data));
              break;
            case EditorEventType.SELECT_ITEM:
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
            case EditorEventType.EXPORT:
              this.export();
              break;
          }
        }
      },
    );
  }

  private loadEditableItems(projectId: number) {
    return this.projectService.getProject(projectId).pipe(
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
          }),
        );
      })
    ).pipe(
      concatMap(async ({project, items}) => {
        console.log('Project with editable items:', project, items);
        try {
          await this.addItems(items);
          //await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
          console.log('Items added successfully');
        } catch (error) {
          console.error('Failed to add items:', error);
          throw error;
        }
      })
    );
  }

  private getLevelColor(item: ItemDTO) {
    return this.state.currentProject?.levels.find(lvl => lvl.name.toLowerCase() === item.data['level'].toLowerCase())?.color;
  }
  simulateClicks() {
    const mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    const mouseupEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    const clickEvent = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    const nodes = this.container.nativeElement.querySelectorAll('[data-testid="node"]');
    nodes.forEach((node: Element) => {
      node.dispatchEvent(mousedownEvent);
      node.dispatchEvent(mouseupEvent);
      node.dispatchEvent(clickEvent);
    });
  }




  private loadEditableRelationships(projectId: number) {
    console.log('nodes', this.editor.getNodes());
    this.relationshipService.getProjectEditableRelationships(projectId).pipe().subscribe({
      next: async (relationships: RelationshipDTO[]) => {
        console.log('Editable relationships:', relationships);
        for (const relationship of relationships) {
            await this.addConnection(relationship);
        }
       await this.arrangeNodes();
        //this.simulateClicks();
        //await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
      },
      error: (error) => {
        console.error('Failed to load relationships:', error);
      }
    });
  }




  async addNode(node: any) {
    node.addOutput(node.id, new ClassicPreset.Output(socket, undefined, true));
    node.addInput(node.id, new ClassicPreset.Input(socket, undefined, true));
     if (!await this.editor.addNode(node)) throw new Error("Error while adding node");
  }

  async addConnection(relationship: RelationshipDTO) {
    const startItem = this.editor.getNode(relationship.startItem.toString());
    const endItem = this.editor.getNode(relationship.endItem.toString());
    await this.editor.addConnection(
      new Connection(startItem, startItem.id, endItem, endItem.id, relationship)
    );
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


    //fixme add connections with help of relationships
    await this.arrange.layout({
      options: {
        'elk.spacing.nodeNode': 100,
        'elk.layered.spacing.nodeNodeBetweenLayers': 300,
        'elk.alignment': 'RIGHT',
        'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS', //LINEAR_SEGMENTS, BRANDES_KOEPF
        'elk.direction': 'RIGHT', //we want DOWN but need to configure sockets,
        'elk.edge.type': 'DIRECTED',
        'elk.radial.centerOnRoot': true,
        'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      },
    });
    await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
  }

  private async addItems(items: ItemDTO[]) {
    for (const item of items) {
      try {
        const data = mapGenericModel(item);
        const lvlColor = this.getLevelColor(item);
        let node = new ItemNode(data!);
        node.backgroundColor = lvlColor!;
        await this.addNode(node);
      } catch (error) {

      }
    }
  }

  private export() {
    let nodesData = [];
    let connectionData = [];

    for (const node of this.editor.getNodes()) {
      if (node instanceof ItemNode) {
        nodesData.push(node.data);
      }
    }

    for (const connection of this.editor.getConnections()) {
      connectionData.push({
        startItem: Number(connection.source),
        endItem: Number(connection.target),
        description: connection.relationshipData.description,
      });
    }

    const exportData = {
      items: nodesData,
      relationships: connectionData
    };

    const jsonString = JSON.stringify(exportData, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-data.json';
    a.click();

    URL.revokeObjectURL(url);
  }

}
