import {ChangeDetectorRef, Injectable} from '@angular/core';
import {ClassicPreset, NodeEditor} from "rete";
import {AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {structures} from "rete-structures";
import {concatMap, from, lastValueFrom, map, Observable, switchMap} from "rxjs";

import {
  CreateItemDTO,
  CreateRelationshipDTO,
  ItemDTO,
  ItemType,
  ProjectDTO,
  RelationshipDTO,
  RelationshipType,
  ReleaseDTO
} from "../../../../gen/model";
import {Item, mapGenericModel, toItemDTO} from "../../models/itemMapper";
import {ItemNode} from "../../items/item-node";
import {ConnProps, ItemEventType, Schemes} from "../../types";
import {Project} from "../../models/project";
import {Release} from "../../models/release";
import {EventService} from "../event/event.service";
import {StateManager} from "../../models/state";
import {ProjectResourceService} from "../../../../gen/services/project-resource";
import {ReleaseResourceService} from "../../../../gen/services/release-resource";
import {ItemResourceService} from "../../../../gen/services/item-resource";
import {Connection} from "../../connection";
import {GraphCycleDetector} from "../../ui/editor/cycleValidation";
import {AreaExtra, unselectAll} from "../../ui/editor/create-editor";
import {RelationshipResourceService} from "../../../../gen/services/relationship-resource";
import {CodeItemsClientResult, GitHubResourceService} from "../../../../gen/services/git-hub-resource";

const socket = new ClassicPreset.Socket('socket');

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  editor!: NodeEditor<Schemes>;
  area!: AreaPlugin<Schemes, AreaExtra>;
  arrange: any;
  private createItemType: ItemType | undefined;
  private cdr!: ChangeDetectorRef;

  constructor(
    private state: StateManager,
    private projectService: ProjectResourceService,
    private releaseService: ReleaseResourceService,
    private itemService: ItemResourceService,
    private relationshipService: RelationshipResourceService,
    private eventService: EventService,
    private githubService: GitHubResourceService,
  ) {
  }

  setChangeDetectorRef(cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  setCreateItemType(itemType: ItemType) {
    this.createItemType = itemType;
  }

  getCreateItemType(): ItemType | undefined {
    return this.createItemType;
  }

  async addItem(item: ItemDTO) {
    const data = mapGenericModel(item);
    const lvlColor = this.getLevelColor(data);
    let node = new ItemNode(data);
    node.backgroundColor = lvlColor!;
    node.addOutput(node.id, new ClassicPreset.Output(socket, undefined, true));
    node.addInput(node.id, new ClassicPreset.Input(socket, undefined, true));
    if (!await this.editor.addNode(node)) throw new Error("Error while adding node");
  }

  async createItem(dto: CreateItemDTO) {
    this.itemService.createItem(dto).subscribe({
      next: item => this.addItem(item)
    });
  }

  editItem(item: Item) {
    const dto = toItemDTO(item);
    this.itemService.updateItem(item.id, dto).subscribe({
      next: async nodeId => {
        let node = this.editor.getNode(nodeId.toString());
        node.updateData({nodeData: item});
        this.eventService.publishItemEvent(ItemEventType.UPDATE_DATA, {id: Number(node.id), itemDTO: dto});
        await this.area.update('node', node.id);
        this.cdr.detectChanges();
        this.eventService.notify("Item was successfully updated.", 'success');
      }
    });
  }

  async addConnectionToEditor(relationship: RelationshipDTO) {
    const startItem = this.editor.getNode(relationship.startItem.toString());
    const endItem = this.editor.getNode(relationship.endItem.toString());
    await this.editor.addConnection(
      new Connection(startItem, startItem.id, endItem, endItem.id, relationship)
    );
  }

  async createConnection(relationship: CreateRelationshipDTO) {
    this.relationshipService.createRelationship(relationship).subscribe({
      next: async result => {
        await this.addConnectionToEditor(result);
      }
    });
  }

  public loadProjectFromPath(params: any) {
    const projectId = Number(params.get('projectId'));
    if (projectId) {
      this.loadEditableItems(projectId).subscribe({
        next: async () => {
          this.loadEditableRelationships(projectId);
        }
      });
    } else {
      console.error('Project ID not found');
    }
  }

  public loadEditableItems(projectId: number): Observable<void> {
    return this.projectService.getProject(projectId).pipe(
      switchMap((projectDTO: ProjectDTO) => this.processProject(projectDTO, projectId)),
      concatMap(async ({project, items}) => {
        try {
          await this.addItems(items);
        } catch (error) {
          console.error('Failed to add items:', error);
          throw error;
        }
      })
    );
  }

  private processProject(projectDTO: ProjectDTO, projectId: number): Observable<{
    project: Project,
    items: ItemDTO[]
  }> {
    const project = new Project(projectDTO);
    return this.releaseService.getAllReleases({params: {projectId: projectId}}).pipe(
      map((releases: ReleaseDTO[]) => {
        releases.forEach(releaseDTO => {
          const release = new Release(releaseDTO);
          project.addRelease(release);
        });
        return project;
      }),
      switchMap((project: Project) => {
        this.state.currentProject = project;
        return this.itemService.getProjectEditableItems(project.id).pipe(
          map((items: ItemDTO[]) => ({project, items}))
        );
      }),
    );
  }

  public loadEditableRelationships(projectId: number): void {
    this.relationshipService.getProjectEditableRelationships(projectId).pipe().subscribe({
      next: async (relationships: RelationshipDTO[]) => {
        console.log('Editable relationships:', relationships);
        for (const relationship of relationships) {
          await this.addConnectionToEditor(relationship);
        }
        await this.arrangeNodes();
      },
      error: (error) => {
        console.error('Failed to load relationships:', error);
      }
    });
  }

  async arrangeNodes(): Promise<void> {
    await this.arrange.layout({
      options: {
        'elk.spacing.nodeNode': 100,
        'elk.layered.spacing.nodeNodeBetweenLayers': 300,
        'elk.alignment': 'RIGHT',
        'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',
        'elk.direction': 'RIGHT',
        'elk.edge.type': 'DIRECTED',
        'elk.radial.centerOnRoot': true,
        'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      },
    });
    await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
  }

  public async addItems(items: ItemDTO[]): Promise<void> {
    for (const item of items) {
      try {
        await this.addItem(item);
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  }

  applyPipes(editor: NodeEditor<Schemes>): void {
    editor.addPipe(async (c) => {
      if (c.type === 'connectioncreate') {
        // Cycle check logic can be uncommented if needed
      }
      return c;
    });
    this.area.addPipe(async (c) => {
      if (c.type === 'pointerdown') {
        const graph = structures(editor);
        await unselectAll(graph);
      }
      return c;
    });
  }

  getRelationshipsData(item: Item): RelationshipDTO[] {
    return this.editor.getConnections()
      .filter(connection => this.isConnectionRelatedToItem(connection, item))
      .map(connection => connection.data as RelationshipDTO);
  }

  getRelationships(item: Item): ConnProps[] {
    return this.editor.getConnections()
      .filter(connection => this.isConnectionRelatedToItem(connection, item));
  }

  private isConnectionRelatedToItem(connection: ConnProps, item: Item): boolean {
    return connection.source === item.id.toString() || connection.target === item.id.toString();
  }

  relationshipExists(startItemId: string, endItemId: string): boolean {
    return this.editor.getConnections().some(connection =>
      connection.source === startItemId && connection.target === endItemId
    );
  }

  getLevelColor(item: Item): string | undefined {
    return this.state.currentProject?.levels.get(item.data['level'].toLowerCase())?.color;
  }

  getLevelName(item: Item): string | undefined {
    return this.state.currentProject?.levels.get(item.data['level'].toLowerCase())?.color;
  }

  public exportEditorContents(): void {
    const exportData = this.prepareExportData();
    this.downloadExportData(exportData);
  }

  private prepareExportData() {
    let nodesData = this.editor.getNodes()
      .filter(node => node instanceof ItemNode)
      .map(node => (node as ItemNode).data);

    let connectionData = this.editor.getConnections().map(connection => ({
      startItem: Number(connection.source),
      endItem: Number(connection.target),
      description: connection.data.description,
    }));

    return {items: nodesData, relationships: connectionData};
  }

  private downloadExportData(exportData: any) {
    const jsonString = JSON.stringify(exportData, null, 4);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.state.currentProject?.name}-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  public async notCreateCycle(startItem: number, endItem: number): Promise<boolean> {
    const tempConnection = await this.addConnectionForCheck(startItem, endItem);
    const graph = structures(this.editor);
    const graphCycleDetector = new GraphCycleDetector(graph);

    const cycleDetected = graphCycleDetector.isCyclic();
    await this.editor.removeConnection(tempConnection);

    return !cycleDetected;
  }

  private async addConnectionForCheck(startItemId: number, endItemId: number) {
    const startItem = this.editor.getNode(startItemId.toString());
    const endItem = this.editor.getNode(endItemId.toString());
    const relationship: CreateRelationshipDTO = {
      startItem: startItemId,
      endItem: endItemId,
      type: RelationshipType.DERIVES,
      description: 'Temporary connection for cycle check'
    };
    const newConnection = new Connection(startItem, startItem.id, endItem, endItem.id, relationship);
    await this.editor.addConnection(newConnection);
    return newConnection.id;
  }

  public async focusOnNode(nodeId: string): Promise<void> {
    const graph = structures(this.editor);
    await AreaExtensions.zoomAt(this.area, graph.nodes().filter(n => n.id === nodeId), {scale: 0.1});
    await this.translateFromSidebar();
  }

  private async translateFromSidebar(): Promise<void> {
    const {x, y} = this.area.area.transform;
    await this.area.area.translate(x - 300, y);
  }

  public focusOnRelationship(relationship: ConnProps): void {
    const graph = structures(this.editor);
    unselectAll(graph);
    relationship.updateData({selected: true});
    AreaExtensions.zoomAt(this.area, graph.nodes().filter(n => n.id === relationship.source || n.id === relationship.target), {scale: 0.4});
    this.translateFromSidebar();
  }

  public deleteRelationship(relationship: ConnProps): void {
    this.relationshipService.deleteRelationship((relationship.data as RelationshipDTO).id).subscribe({
      next: async () => {
        await this.editor.removeConnection(relationship.id);
      },
      error: (err) => this.eventService.notify(err.error.message, 'error')
    });
  }

  public getStatuses(itemType: ItemType): string[] {
    const statusMap = {
      [ItemType.REQUIREMENT]: ['Open', 'Closed', 'TBD'],
      [ItemType.CODE]: ['Open', 'Tested', 'Closed'],
      [ItemType.TEST]: ['Planned', 'Completed', 'Failed'],
      [ItemType.DESIGN]: ['Open', 'Implemented', 'Closed'],
    };
    return (statusMap[itemType] || []).map(s => s.toUpperCase());
  }

  public getLevelNames(itemType: ItemType): string[] {
    let levels = this.state.currentProject?.levels;
    const excludedLevels = ['Code', 'Design', 'Test'];

    if (itemType === ItemType.REQUIREMENT) {
      return Array.from(levels!.keys())
        .filter(levelName => !excludedLevels.includes(levelName));
    }

    const levelMap = {
      [ItemType.CODE]: ['Code'],
      [ItemType.DESIGN]: ['Design'],
      [ItemType.TEST]: ['Test'],
    };

    return levelMap[itemType] || [];
  }

  async updateRelationship(changedData: CreateRelationshipDTO) {
    const existing = this.editor.getConnections().find(conn =>
      conn.source === changedData.startItem.toString() && conn.target === changedData.endItem.toString()
    );
    if (existing) {
      this.updateExistingRelationship(existing, changedData);
    }
  }

  private updateExistingRelationship(existing: ConnProps, changedData: CreateRelationshipDTO) {
    const data = existing.data as RelationshipDTO;
    Object.assign(data, changedData);
    this.relationshipService.updateRelationship(data.id, data).subscribe({
      next: async result => {
        await this.editor.removeConnection(existing.id);
        existing.updateData(result);
        const source = this.editor.getNode(existing.source);
        const target = this.editor.getNode(existing.target);
        await this.editor.addConnection(
          new Connection(source, existing.sourceOutput, target, existing.targetInput, result)
        );
      }
    });
  }

  itemsExist(startItem: string, endItem: string): boolean {
    try {
      const start = this.editor.getNode(startItem);
      const end = this.editor.getNode(endItem);
      return (start !== undefined) && (end !== undefined);
    } catch (e) {
      return false;
    }
  }

  async deleteItemWithConnections(payload: { item: string, relationships: number[] }) {
    from(this.editor.removeNode(payload.item)).pipe(
      concatMap(() => from(payload.relationships).pipe(
        concatMap(conn => from(this.editor.removeConnection(conn.toString())).pipe(
          concatMap(() => from(this.relationshipService.deleteRelationship(conn)))
        )),
        concatMap(() => from(this.itemService.deleteItem(Number(payload.item)))),
      ))
    ).subscribe({
      complete: () => this.eventService.notify(`Item ${payload.item} with its adjacent edges was deleted successfully`, 'success')
    });
  }

  async fetchCodeItems() {
    const projectId = this.state.currentProject?.id!;
   this.githubService.codeItems(projectId).subscribe(
       {
           next: result => {
               console.log("result", result);
               this.setupCodeItems(result.updatedItems).then(
                    () => this.setupRelationshipsWithCodeItems(result.newRelationships).then(
                        () => {
                          setTimeout( async () => await this.arrangeNodes(), 3000);
                        }
                    )
               )

           }
       }
   )
  }

  private async setupCodeItems(updatedItems: ItemDTO[] | undefined) {
    this.deleteItemsByConditionFromEditor(item => item.itemType === ItemType.CODE).then(
        async () => {
          if (updatedItems) {
            console.log("updatedItems", updatedItems);
            await this.addItems(updatedItems);
          }
        }
    )

  }

  private async setupRelationshipsWithCodeItems(newRelationships: RelationshipDTO[] | undefined) {
    const graph = structures(this.editor);
    let existingCodeItemIds = graph.filter(node => node.data.itemType === ItemType.CODE).nodes().map(n => n.id);
    await this.deleteFromEditorRelationshipsByCondition(relationship =>
      existingCodeItemIds.includes(relationship.startItem.toString()) ||
      existingCodeItemIds.includes(relationship.endItem.toString())
    ).then(
        async () => {
          console.log("new relationships")
          for (const rel of newRelationships!) {
            await this.addConnectionToEditor(rel);
          }
        }
    )
  }

  private async deleteItemsByConditionFromEditor(predicate: (item: Item) => boolean) {
    const graph = structures(this.editor);
    let nodesToDelete = graph.filter(node => predicate(node.data)).nodes();
    for (const nodeToDelete of nodesToDelete) {
      await this.editor.removeNode(nodeToDelete.id);
    }
  }

  private async deleteFromEditorRelationshipsByCondition(predicate: (relationship: RelationshipDTO) => boolean) {
    const graph = structures(this.editor);
    let connectionsToDelete = graph.connections().filter(conn => predicate(conn.data as RelationshipDTO));
    for (const connectionToDelete of connectionsToDelete) {
      await this.editor.removeConnection(connectionToDelete.id);
    }
  }
}
