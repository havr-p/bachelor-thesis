import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';
import { ContextMenuExtra, ContextMenuPlugin } from 'rete-context-menu-plugin';
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin';

import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import {
  AngularArea2D,
  AngularPlugin,
  Presets as AngularPresets,
} from 'rete-angular-plugin/17';

import { CustomSocketComponent } from '../../customization/custom-socket/custom-socket.component';
import { CustomConnectionComponent } from '../../customization/custom-connection/custom-connection.component';

import { addCustomBackground } from '../../customization/custom-background';
import { EventService } from '../../../services/event.service';
import { Requirement } from '../../models/requirement';
import { EditorEvent, ItemProps } from '../../types';
import { structures } from 'rete-structures';
import { Connection } from '../../connection';
import { MenuItem } from 'primeng/api';
import { RequirementItem } from '../../items/requirement-item';
import { RequirementItemComponent } from '../items/requirement-item/requirement-item.component';

type Schemes = GetSchemes<
  ItemProps,
  Connection<RequirementItem, RequirementItem>
>;
type AreaExtra =
  | Area2D<Schemes>
  | AngularArea2D<Schemes>
  | ContextMenuExtra
  | MinimapExtra;

const socket = new ClassicPreset.Socket('socket');

export async function createEditor(
  container: HTMLElement,
  injector: Injector,
  eventService: EventService,
) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const minimap = new MinimapPlugin<Schemes>();
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: (context, plugin) => {
      console.log(context);
      const graph = structures(editor);
      if (context instanceof RequirementItem) {
        const selectedNodeId = context.id;
        return {
          searchBar: false,
          list: [
            {
              //fixme maybe we can use parent-child relationship to show lineage
              handler: () => {
                const incomingConnections = graph
                  .connections()
                  .filter((connection) => connection.target === selectedNodeId);
                graph
                  .predecessors(selectedNodeId)
                  .connections()
                  .concat(incomingConnections)
                  .forEach((connection) => {
                    connection.updateData({
                      isSelected: true,
                    });
                  });
              },
              key: '1',
              label: 'Show lineage',
            },
            {
              label: 'Hide lineage',
              key: '2',
              handler: () => {
                graph.connections().forEach((connection) => {
                  connection.updateData({ isSelected: false });
                });
              },
            },
            {
              label: 'Edit node',
              key: '3',
              handler: () => {
                eventService.publishEditorEvent(EditorEvent.SELECT, context);
              },
            },
            {
              label: 'Delete node',
              key: '4',
              handler: () => {
                editor.removeNode(selectedNodeId);
                const incomingConnections = graph
                  .connections()
                  .filter((connection) => connection.target === selectedNodeId);
                const outgoingConnections = graph
                  .connections()
                  .filter((connection) => connection.source === selectedNodeId);
                incomingConnections.forEach((connection) =>
                  editor.removeConnection(connection.id),
                );
                outgoingConnections.forEach((connection) =>
                  editor.removeConnection(connection.id),
                );
              },
            },
            // {
            //   label: 'Collection', key: '1', handler: () => null,
            //   subitems: [
            //     { label: 'Subitem', key: '1', handler: () => console.log('Subitem') }
            //   ]
            // }
          ],
        };
      }
      return {
        searchBar: false,
        list: [
          {
            label: 'Root context menu item',
            key: '2',
            handler: () => {},
          },
        ],
      };
    },
    // items: ContextMenuPresets.classic.setup([
    //   ['Source', () => new SourceNode()],
    //   [
    //     'Requirement',
    //     () =>
    //       new RequirementNode({
    //         id: '1',
    //         name: 'Test',
    //         statement: 'Test',
    //         references: [],
    //         status: 'Test',
    //         level: 'Test',
    //       }),
    //   ],
    // ]),
  });

  const angularRender = new AngularPlugin<Schemes, AreaExtra>({ injector });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  angularRender.addPreset(
    AngularPresets.classic.setup({
      customize: {
        node() {
          return RequirementItemComponent;
        },
        connection() {
          return CustomConnectionComponent;
        },
        socket() {
          return CustomSocketComponent;
        },
      },
    }),
  );
  angularRender.addPreset(AngularPresets.minimap.setup());
  angularRender.addPreset(AngularPresets.contextMenu.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  addCustomBackground(area);

  editor.use(area);
  area.use(connection);

  area.use(angularRender);
  area.use(minimap);
  area.use(contextMenu);

  AreaExtensions.simpleNodesOrder(area);

  const aLabel = 'Custom';
  const bLabel = 'Custom';

  const a = new ClassicPreset.Node(aLabel);
  a.addOutput('a', new ClassicPreset.Output(socket));
  a.addInput('a', new ClassicPreset.Input(socket));
  //await editor.addNode(a);

  const b = new ClassicPreset.Node(bLabel);
  b.addOutput('a', new ClassicPreset.Output(socket));
  b.addInput('a', new ClassicPreset.Input(socket));
  //await editor.addNode(b);

  await area.translate(a.id, { x: 0, y: 0 });
  await area.translate(b.id, { x: 300, y: 0 });

  //await editor.addConnection(new ClassicPreset.Connection(a, 'a', b, 'a'));

  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 300);

  //const arrange = new AutoArrangePlugin<Schemes>();

  //arrange.addPreset(ArrangePresets.classic.setup());

  //area.use(arrange);

  return {
    destroy: () => area.destroy(),
    editor: editor,
    area: area,
    //  arrange: arrange,
  };
}

@Component({
  selector: 'app-traceability-editor',
  templateUrl: './traceability-editor.component.html',
  styleUrl: './traceability-editor.component.scss',
})
export class TraceabilityEditorComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('rete') container!: ElementRef<HTMLElement>;
  destroyEditor: any;
  editor!: NodeEditor<Schemes>;
  area: any;
  arrange: any;
  sidebarVisible = false;
  openedItem: any;

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

  constructor(
    private injector: Injector,
    private eventService: EventService,
  ) {
    //     // @ts-ignore
    //     this.arrange = new AutoArrangePlugin<Schemes>();
    //
    // this.arrange.addPreset(ArrangePresets.classic.setup());
    //
    //   this.area.use(this.arrange);
  }

  async ngAfterViewInit() {
    const el = this.container.nativeElement;

    if (el) {
      this.loading = true;
      createEditor(el, this.injector, this.eventService).then(
        ({ destroy, editor, area }) => {
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
    this.eventService.event$.subscribe(
      async (event: { type: string; data: any }) => {
        switch (event.type) {
          case EditorEvent.DEMO:
            await this.processDemoEvent(event.data);
            break;
          case EditorEvent.ADD:
            await this.addNode(new RequirementItem(event.data));
            break;
          case EditorEvent.SELECT:
            console.log('selected', event.data);
            this.openedItem = event.data;
            this.sidebarVisible = true;
            break;
        }
      },
    );
  }

  private async processDemoEvent(data: Requirement[]) {
    for (let req of data) {
      //console.log(JSON.stringify(req));
      let requirement = new RequirementItem(req);
      requirement.addOutput(requirement.id, new ClassicPreset.Output(socket));
      requirement.addInput(requirement.id, new ClassicPreset.Input(socket));
      await this.editor.addNode(requirement);
    }
    //console.log(this.editor.getNodes())

    //const arrange = new AutoArrangePlugin<Schemes>();

    this.arrange.addPreset(ArrangePresets.classic.setup());

    this.area.use(this.arrange);

    for (let node of this.editor.getNodes()) {
      //console.log(node);
      if (node instanceof RequirementItem) {
        const parentRefs = node.requirement.references;
        for (const ref of parentRefs) {
          const parent = this.editor.getNode(ref.parentId);
          if (parent) {
            await this.editor.addConnection(
              new Connection(parent, parent.id, node, node.id),
            );
          }
        }
      }
    }
    await this.arrange.layout({
      options: {
        'elk.spacing.nodeNode': 300,
        'elk.layered.spacing.nodeNodeBetweenLayers': 400,
        'elk.alignment': 'RIGHT',
        'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS', //also LINEAR_SEGMENTS
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

  async addNode(node: any) {
    node.addOutput(node.id, new ClassicPreset.Output(socket));
    node.addInput(node.id, new ClassicPreset.Input(socket));
    await this.editor.addNode(node);
  }

  get openedItemTitle(): string {
    console.log('openedItem', this.openedItem);
    if (this.openedItem) return this.openedItem.requirement.name;
    return 'item not defined';
  }

  ngOnDestroy(): void {
    if (this.destroyEditor) {
      this.destroyEditor();
    }
  }
}
