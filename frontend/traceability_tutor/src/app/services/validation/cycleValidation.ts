import {Structures} from "rete-structures/_types/types";
import {ConnProps, ItemProps, Schemes} from "../../types";
import {NodeEditor} from "rete";
import {structures} from "rete-structures";
import {CreateRelationshipDTO, RelationshipType} from "../../../../gen/model";
import {Connection} from "../../connection";

export class GraphCycleValidator {
    private readonly editor: NodeEditor<Schemes>

    constructor(editor: NodeEditor<Schemes>) {
        this.editor = editor;
    }

    public isCyclic(): boolean {
        const nodes = structures(this.editor).nodes();
        const visited: { [key: string]: boolean } = {};
        const dfs: { [key: string]: boolean } = {};

        for (const node of nodes) {
            visited[node.id] = false;
            dfs[node.id] = false;
        }

        for (const node of nodes) {
            if (!visited[node.id]) {
                if (this.checkCycle(node.id, structures(this.editor), visited, dfs)) {
                    return true;
                }
            }
        }

        return false;
    }

    private checkCycle(nodeId: string, graph: any, visited: { [key: string]: boolean }, dfs: { [key: string]: boolean }): boolean {
        visited[nodeId] = true;
        dfs[nodeId] = true;

        const outgoingNodes = graph.successors(nodeId).nodes();

        for (const neighbor of outgoingNodes) {
            if (!visited[neighbor.id]) {
                if (this.checkCycle(neighbor.id, graph, visited, dfs)) {
                    return true;
                }
            } else if (dfs[neighbor.id]) {
                return true;
            }
        }

        dfs[nodeId] = false;
        return false;
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
}
