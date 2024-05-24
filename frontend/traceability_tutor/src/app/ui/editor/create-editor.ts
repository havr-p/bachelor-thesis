import {Injector} from "@angular/core";
import {EventService} from "../../services/event/event.service";
import {ClassicPreset, GetSchemes, NodeEditor} from "rete";
import {Area2D, AreaExtensions, AreaPlugin} from "rete-area-plugin";
import {ConnectionPlugin, Presets as ConnectionPresets} from "rete-connection-plugin";
import {MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {ContextMenuExtra, ContextMenuPlugin} from "rete-context-menu-plugin";
import {structures} from "rete-structures";
import {ItemNode} from "../../items/item-node";
import {EditorEventType, ItemProps} from "../../types";
import {AngularArea2D, AngularPlugin, Presets as AngularPresets} from "rete-angular-plugin/17";
import {ItemComponent} from "../items/item/item.component";
import {CustomConnectionComponent} from "../../customization/custom-connection/custom-connection.component";
import {CustomSocketComponent} from "../../customization/custom-socket/custom-socket.component";
import {addCustomBackground} from "../../customization/custom-background";
import {Connection} from "../../connection";
import { AutoArrangePlugin, Presets as ArrangePresets } from "rete-auto-arrange-plugin";

type Schemes = GetSchemes<
  ItemProps,
  Connection<ItemProps, ItemProps>
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
      if (context instanceof ClassicPreset.Connection) {
          return {
            searchBar: false,
            list: [{

                label: 'Edit connection',
                key: '4',
                handler: () => {
                  eventService.publishEditorEvent(
                      EditorEventType.SELECT_RELATIONSHIP,
                      context)
                }
              },
            ]}
      }
      if (context instanceof ItemNode) {
        const selectedNodeId = context.id;
        return {
          searchBar: false,
          list: [
            {
              key: '1',
              label: 'Show backward lineage',
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
                      selected: true,
                    });
                  });
              },
            },
            {
              key: '2',
              label: 'Show forward lineage',
              //fixme maybe we can use parent-child relationship to show lineage
              handler: () => {
                const outgoingConnections = graph
                    .connections()
                    .filter((connection) => connection.source === selectedNodeId);
                graph
                    .successors(selectedNodeId)
                    .connections()
                    .concat(outgoingConnections)
                    .forEach((connection) => {
                      connection.updateData({
                        selected: true,
                      });
                    });
              },
            },
            {
              label: 'Hide lineage',
              key: '3',
              handler: () => {
                graph.connections().forEach((connection) => {
                  connection.updateData({selected: false});
                });
              },
            },
            {
              label: 'Edit node',
              key: '4',
              handler: () => {
                eventService.publishEditorEvent(
                  EditorEventType.SELECT_ITEM,
                  context,
                );
              },
            },
            {
              label: 'Delete node',
              key: '5',
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

          ],
        };
      }
      return {
        searchBar: false,
        list: [
          {
            label: 'Root context menu item',
            key: '2',
            handler: () => {
            },
          },
        ],
      };
    },

  });

  const angularRender = new AngularPlugin<Schemes, AreaExtra>({injector});

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  angularRender.addPreset(
    AngularPresets.classic.setup({
      customize: {
        node(context) {
          return ItemComponent;
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

  //addCustomBackground(area);

  editor.use(area);
  area.use(connection);

  area.use(angularRender);
  area.use(minimap);
  area.use(contextMenu);

  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 300);

  const arrange = new AutoArrangePlugin<Schemes>();

  arrange.addPreset(ArrangePresets.classic.setup());

  area.use(arrange);

  return {
    destroy: () => area.destroy(),
    editor: editor,
    area: area,
    arrange: arrange,
  };
}
