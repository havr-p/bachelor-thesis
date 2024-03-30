import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

// import {ClassicPreset, ClassicPreset as Classic, GetSchemes, NodeEditor} from 'rete';
// import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
//
// import {
//   AngularPlugin,
//   AngularArea2D,
//   Presets as AngularPresets,
// } from 'rete-angular-plugin/17';
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';
import { ContextMenuExtra } from 'rete-context-menu-plugin';
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
import { RequirementItemComponent } from '../../customization/requirement-node/requirement-item.component';
import { RequirementItem } from '../../nodes/requirementItem';

class Connection<N extends RequirementItem> extends ClassicPreset.Connection<
  N,
  N
> {}

type Schemes = GetSchemes<RequirementItem, Connection<RequirementItem>>;
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

  connection.addPreset(ConnectionPresets.classic.setup());

  addCustomBackground(area);

  editor.use(area);
  area.use(connection);

  area.use(angularRender);
  area.use(minimap);

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

  logReq(r: Requirement) {
    JSON.stringify(r);
  }

  ngOnInit(): void {
    this.eventService.event$.subscribe(
      async (eventData: { type: string; data: Requirement[] }) => {
        if (eventData.type === 'demo') {
          let data = eventData.data;
          for (let req of eventData.data) {
            //console.log(JSON.stringify(req));
            let requirement = new RequirementItem(req);
            requirement.addOutput(
              requirement.id,
              new ClassicPreset.Output(socket),
            );
            requirement.addInput(
              requirement.id,
              new ClassicPreset.Input(socket),
            );
            await this.editor.addNode(requirement);
          }
          //console.log(this.editor.getNodes())

          //const arrange = new AutoArrangePlugin<Schemes>();

          this.arrange.addPreset(ArrangePresets.classic.setup());

          this.area.use(this.arrange);

          for (let node of this.editor.getNodes()) {
            //console.log(node);
            if (node instanceof RequirementItem) {
              for (const requirementReferences of data.find(
                (r) => r.id === node.id,
              )!.references) {
                const parent = this.editor.getNode(
                  requirementReferences.parentId,
                );
                if (parent) {
                  await this.editor.addConnection(
                    new ClassicPreset.Connection(
                      parent,
                      parent.id,
                      node,
                      node.id,
                    ),
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
        } else if (eventData.type === 'add') {
          console.log('catched');
          let node = new RequirementItem(eventData.data[0]);
          // @ts-ignore
          node.addInput(
            'text',
            new ClassicPreset.Input(new TextSocket(), 'Text'),
          );
          // @ts-ignore
          node.addOutput(
            'text',
            new ClassicPreset.Output(new TextSocket(), 'Text'),
          );
          await this.editor.addNode(node);
        }
      },
    );
  }
  async addNode(node: any) {
    await this.editor.addNode(node);
  }

  ngOnDestroy(): void {
    if (this.destroyEditor) {
      this.destroyEditor();
    }
  }
}
