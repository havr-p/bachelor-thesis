import {ClassicPreset} from 'rete';
import {ItemDTO} from "../../../gen/model";

export class ItemNode extends ClassicPreset.Node {
    width = 400;
    height = 200;
    backgroundColor: string | undefined;
    data: ItemDTO;
    highlighted: boolean = false;

    constructor(itemDTO: ItemDTO) {
        super(itemDTO.data['name']);
        this.data = itemDTO;
        this.id = itemDTO.id.toString();
        this.selected = false;
    }

    updateData(param: { selected?: boolean, highlighted?: boolean }) {
        this.selected = param.selected ?? this.selected;
        this.highlighted = param.highlighted ?? this.highlighted;
    }
}
