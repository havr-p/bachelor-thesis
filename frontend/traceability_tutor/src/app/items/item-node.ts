import {ClassicPreset} from 'rete';
import {Item} from "../models/itemMapper";

export class ItemNode extends ClassicPreset.Node {
    width = 400;
    height = 200;
    backgroundColor: string | undefined;
    data: Item;
    highlighted: boolean = false;

    constructor(itemDTO: Item) {
        super(itemDTO.data['name']);
        this.data = itemDTO;
        this.id = itemDTO.id.toString();
        this.selected = false;
    }

    updateData(param: { selected?: boolean, highlighted?: boolean, nodeData?: Item }) {
        this.selected = param.selected ?? this.selected;
        this.highlighted = param.highlighted ?? this.highlighted;
        if (param.nodeData) {
            this.data = param.nodeData;
            this.label = this.data.data.name

        }
      console.log("data changed");
    }
}
