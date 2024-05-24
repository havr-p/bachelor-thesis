import {Structures} from "rete-structures/_types/types";
import {ConnProps, ItemProps} from "../../types";

export function findSelf(graph: Structures<ItemProps, ConnProps>, node: ItemProps, inputNodes: ItemProps[]) {
    if (inputNodes.some(n => n === node))
        return true;

    for (const element of inputNodes) {
        if (findSelf(graph, node, graph.predecessors(element.id).nodes()))
            return true;
    }
    return false;
}
