import {Structures} from "rete-structures/_types/types";
import {ConnProps, ItemProps, Schemes} from "../../types";

export class GraphCycleDetector {
    private readonly graph:  Structures<ItemProps, ConnProps>

    constructor(graph:  Structures<ItemProps, ConnProps>) {
        this.graph = graph;
    }

    public isCyclic(): boolean {
        const nodes = this.graph.nodes();
        const vis: { [key: string]: boolean } = {};
        const dfsVis: { [key: string]: boolean } = {};

        for (const node of nodes) {
            vis[node.id] = false;
            dfsVis[node.id] = false;
        }

        for (const node of nodes) {
            if (!vis[node.id]) {
                if (this.checkCycle(node.id, this.graph, vis, dfsVis)) {
                    return true;
                }
            }
        }

        return false;
    }

    private checkCycle(nodeId: string, graph: any, vis: { [key: string]: boolean }, dfsVis: { [key: string]: boolean }): boolean {
        vis[nodeId] = true;
        dfsVis[nodeId] = true;

        const outgoingNodes = graph.successors(nodeId).nodes();

        for (const neighbor of outgoingNodes) {
            if (!vis[neighbor.id]) {
                if (this.checkCycle(neighbor.id, graph, vis, dfsVis)) {
                    return true;
                }
            } else if (dfsVis[neighbor.id]) {
                return true;
            }
        }

        dfsVis[nodeId] = false;
        return false;
    }
}
