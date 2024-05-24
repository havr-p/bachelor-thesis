import {Requirement, RequirementData} from '../models/requirement';
import {getColorByLevel} from '../utils';
import {Item} from './Item';
import {ClassicPreset} from 'rete';
import {HistoryAction, ItemType} from "../../../gen/model";
import {StateManager} from "../models/state";

export class ItemNode extends ClassicPreset.Node {
  width = 400;
  height = 200;
  type = ItemType.REQUIREMENT;
  backgroundColor: string | undefined;
  borderStyle: string = '2px solid black';
  data: RequirementData;
  itemType: ItemType;
  name: string;
  projectId: number;
  internalProjectUUID: string;
  releaseId?: number;
  status?: string;
  historyAction?: HistoryAction;

  constructor(requirement: Requirement) {
    super(requirement.data.name);
    this.data = requirement.data;
    this.id = requirement.id.toString();
    this.internalProjectUUID = requirement.internalProjectUUID;
    this.itemType = requirement.itemType;
    this.name = requirement.data.name;
    this.projectId = requirement.projectId;
    this.releaseId = requirement.releaseId;
    this.status = requirement.status;
    this.historyAction = requirement.historyAction;
    this.selected = false;
  }
}
