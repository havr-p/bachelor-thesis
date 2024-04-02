import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

// import {ClassicPreset, ClassicPreset as Classic, GetSchemes, NodeEditor} from 'rete';
// import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
//
// import {
//   AngularPlugin,
//   AngularArea2D,
//   Presets as AngularPresets,
// } from 'rete-angular-plugin/17';

import { DataflowEngine, DataflowNode } from 'rete-engine';
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';
import { ReadonlyPlugin } from 'rete-readonly-plugin';
import {
  ContextMenuPlugin,
  ContextMenuExtra,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin';
// import {addCustomBackground} from "../../customization/custom-background";
// import {RequirementNode} from "../../nodes/requirement.node";
// import {CustomConnectionComponent} from "../../customization/custom-connection/custom-connection.component";
// import {CustomSocketComponent} from "../../customization/custom-socket/custom-socket.component";
// import {EventService} from "../../../services/event.service";
// import {Requirement} from "../../models/requirement";
// import {RequirementNodeComponent} from "../requirement-node/requirement-node.component";
// import {
//   ConnectionPlugin,
//   Presets as ConnectionPresets
// } from "rete-connection-plugin";
// import { Schemes } from 'src/app/types';
// import {TextSocket} from "../../sockets";
// import {CustomNodeComponent} from "../../customization/custom-node/custom-node.component";

// class NumberNode extends Classic.Node implements DataflowNode {
//   width = 180;
//   height = 120;
//
//   constructor(initial: number, change?: (value: number) => void) {
//     super('Number');
//
//     this.addOutput('value', new Classic.Output(socket, 'Number'));
//     this.addControl(
//       'value',
//       new Classic.InputControl('number', { initial, change })
//     );
//   }
//   data() {
//     const value = (this.controls['value'] as Classic.InputControl<'number'>)
//       .value;
//
//     return {
//       value,
//     };
//   }
// }
//
// class AddNode extends Classic.Node implements DataflowNode {
//   width = 180;
//   height = 195;
//
//   constructor() {
//     super('Add');
//
//     this.addInput('a', new Classic.Input(socket, 'A'));
//     this.addInput('b', new Classic.Input(socket, 'B'));
//     this.addOutput('value', new Classic.Output(socket, 'Number'));
//     this.addControl(
//       'result',
//       new Classic.InputControl('number', { initial: 0, readonly: true })
//     );
//   }
//   data(inputs: { a?: number[]; b?: number[] }) {
//     const { a = [], b = [] } = inputs;
//     const sum = (a[0] || 0) + (b[0] || 0);
//
//     (this.controls['result'] as Classic.InputControl<'number'>).setValue(sum);
//
//     return {
//       value: sum,
//     };
//   }
// }
//
// type AreaExtra =
//   | Area2D<Schemes>
//   | AngularArea2D<Schemes>
//   | ContextMenuExtra
//   | MinimapExtra;
//
// const socket = new Classic.Socket('socket');
//
// export async function createEditor(container: HTMLElement, injector: Injector) {
//   const editor = new NodeEditor<Schemes>();
//   const area = new AreaPlugin<Schemes, AreaExtra>(container);
//
//   const angularRender = new AngularPlugin<Schemes, AreaExtra>({ injector });
//
//   const readonly = new ReadonlyPlugin<Schemes>();
//   const contextMenu = new ContextMenuPlugin<Schemes>({
//     items: ContextMenuPresets.classic.setup([
//      // ['Number', () => new NumberNode(1, process)],
//      // ['Add', () => new AddNode()],
//     ]),
//   });
//   const minimap = new MinimapPlugin<Schemes>();
//   const connection = new ConnectionPlugin<Schemes, AreaExtra>();
//
//   editor.use(readonly.root);
//   addCustomBackground(area);
//   editor.use(area);
//   area.use(readonly.area);
//
//   area.use(angularRender);
//
//   area.use(contextMenu);
//   area.use(minimap);
//   area.area.setZoomHandler(null);
//
//   angularRender.addPreset(
//     AngularPresets.classic.setup({
//       customize: {
//         node() {
//           return CustomNodeComponent;
//         },
//         connection() {
//           return CustomConnectionComponent;
//         },
//         socket() {
//           return CustomSocketComponent;
//         },
//       },
//     })
//   );
//
//   angularRender.addPreset(AngularPresets.contextMenu.setup());
//   angularRender.addPreset(AngularPresets.minimap.setup());
//   connection.addPreset(ConnectionPresets.classic.setup());
//
//   const dataflow = new DataflowEngine<Schemes>();
//
//   editor.use(dataflow);
//
//    //const a = new RequirementNode(process);
//   // const b = new RequirementNode(process);
//    //const add = new AddNode();
//
//   // await editor.addNode(a);
//   // await editor.addNode(b);
//    //await editor.addNode(add);
//
//   // await editor.addConnection(new Connection(a, 'value', add, 'a'));
//  //  await editor.addConnection(new Connection(b, 'value', add, 'b'));
//
//   const arrange = new AutoArrangePlugin<Schemes>();
//
//   arrange.addPreset(ArrangePresets.classic.setup());
//   //arrange.addPreset(ArrangePresets.classic.setup());
//
//   area.use(arrange);
//
//   await arrange.layout();
//
//   AreaExtensions.zoomAt(area, editor.getNodes());
//
//
//   AreaExtensions.simpleNodesOrder(area);
//
//   const selector = AreaExtensions.selector();
//   const accumulating = AreaExtensions.accumulateOnCtrl();
//
//   AreaExtensions.selectableNodes(area, selector, { accumulating });
//
//   async function process() {
//     dataflow.reset();
//
//     editor
//       .getNodes()
//       .filter((node) => node instanceof RequirementNode)
//       .forEach(async (node) => {
//         const info = await dataflow.fetch(node.id);
//
//         console.log(node.id, 'contains', info);
//
//         // area.update(
//         //   'control',
//         //   (node.controls['result'] as Classic.InputControl<'number'>).id
//         // );
//       });
//   }
//
//   editor.addPipe((context) => {
//     if (
//       context.type === 'connectioncreated' ||
//       context.type === 'connectionremoved'
//     ) {
//       process();
//     }
//     return context;
//   });
//
//   process();
//
// //  readonly.enable();
//
//   return {
//     destroy: () => area.destroy(),
//     editor: editor,
//     area: area,
//     arrange: arrange,
//   };
// }

import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { Injector } from '@angular/core';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import {
  AngularPlugin,
  AngularArea2D,
  Presets as AngularPresets,
} from 'rete-angular-plugin/17';

import { CustomSocketComponent } from '../../customization/custom-socket/custom-socket.component';
import { CustomConnectionComponent } from '../../customization/custom-connection/custom-connection.component';

import { addCustomBackground } from '../../customization/custom-background';
import { EventService } from '../../../services/event.service';
import { Requirement } from '../../models/requirement';
import { RequirementNodeComponent } from '../../customization/requirement-node/requirement-node.component';
import { RequirementNode } from '../../nodes/requirement.node';
import { Events, NodeProps } from '../../types';
import { structures } from 'rete-structures';
import { Subject } from 'rxjs';
import { Connection } from '../../connection';

type Schemes = GetSchemes<
  NodeProps,
  Connection<RequirementNode, RequirementNode>
>;
type AreaExtra =
  | Area2D<Schemes>
  | AngularArea2D<Schemes>
  | ContextMenuExtra
  | MinimapExtra;

const socket = new ClassicPreset.Socket('socket');

export async function createEditor(container: HTMLElement, injector: Injector) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const minimap = new MinimapPlugin<Schemes>();
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items(context, plugin) {
      const graph = structures(editor);
      if (context instanceof RequirementNode) {
        const selectedNodeId = context.id;
        return {
          searchBar: false,
          list: [
            {
              //fixme maybe we can use parent-child relationship to show lineage, also not selecting first incomers
              handler: () => {
                graph
                  .predecessors(selectedNodeId)
                  // .union(
                  //   graph.filter(
                  //     Boolean,
                  //     ({ source, target }) => target === selectedNodeId,
                  //   ),
                  // )
                  .connections()
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
                console.log(graph.connections());
                graph.connections().forEach((connection) => {
                  connection.updateData({ isSelected: false });
                });
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
          return RequirementNodeComponent;
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
      createEditor(el, this.injector).then(({ destroy, editor, area }) => {
        this.destroyEditor = destroy;
        this.editor = editor;
        this.area = area;
        this.arrange = new AutoArrangePlugin<Schemes>();

        this.arrange.addPreset(ArrangePresets.classic.setup());

        this.area.use(this.arrange);
      });
    }
  }

  ngOnInit(): void {
    this.eventService.event$.subscribe(
      async (event: { type: string; data: any }) => {
        switch (event.type) {
          case Events.DEMO:
            await this.processDemoEvent(event.data);
            break;
          case Events.ADD:
            await this.addNode(new RequirementNode(event.data));
            break;
        }
      },
    );
  }

  private async processDemoEvent(data: Requirement[]) {
    for (let req of data) {
      //console.log(JSON.stringify(req));
      let requirement = new RequirementNode(req);
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
      if (node instanceof RequirementNode) {
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

  ngOnDestroy(): void {
    if (this.destroyEditor) {
      this.destroyEditor();
    }
  }
}
