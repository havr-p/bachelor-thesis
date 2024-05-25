import {Injectable} from '@angular/core';
import {ClassicPreset} from "rete";
import {ItemDTO} from "../../../../gen/model";
import {mapGenericModel} from "../../models/itemMapper";
import {ItemNode} from "../../items/item-node";

const socket = new ClassicPreset.Socket('socket');

@Injectable({
    providedIn: 'root'
})
export class EditorService {
    //editor!: NodeEditor<Schemes>;
    constructor() {
        // this.editor = editor;
    }

    async addNode(node: any) {
        node.addOutput(node.id, new ClassicPreset.Output(socket));
        node.addInput(node.id, new ClassicPreset.Input(socket));
        //await this.editor.addNode(node);
    }

    async addItems(items: ItemDTO[]) {
        for (const item of items) {
            try {
                const data = mapGenericModel(item);
                await this.addNode(new ItemNode(data!));
            } catch (error) {

            }
        }
    }
    public async notCreateCycle(startItem: number, endItem: number): Promise<boolean> {
        const tempConnection = await this.addConnectionForCheck(startItem, endItem);
      console.log("temp", tempConnection);
        const graph = structures(this.editor);
        const graphCycleDetector = new GraphCycleDetector(graph);

        const cycleDetected = graphCycleDetector.isCyclic();
        console.log("cycle detected?", cycleDetected)

        await this.editor.removeConnection(tempConnection);

        return !cycleDetected;
    }


}
