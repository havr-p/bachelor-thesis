import {Requirement, RequirementData} from '../models/requirement';
import {ClassicPreset} from 'rete';
import {HistoryAction, ItemDTO, ItemType} from "../../../gen/model";

export class ItemNode extends ClassicPreset.Node {
  width = 400;
  height = 200;
  backgroundColor: string | undefined;
  data: ItemDTO;

  constructor(itemDTO: ItemDTO) {
    super(itemDTO.data['name']);
    this.data = itemDTO;
    this.id = itemDTO.id.toString();
    this.selected = false;
  }
}
