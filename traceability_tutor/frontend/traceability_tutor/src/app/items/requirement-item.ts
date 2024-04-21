import { Requirement } from '../models/requirement';
import { getColorByLevel } from '../utils';
import { Item } from './Item';
import { ClassicPreset } from 'rete';
import { ItemType } from '../types';

export class RequirementItem extends ClassicPreset.Node implements Item {
  width = 400;
  height = 200;
  type = ItemType.REQUIREMENT;
  backgroundColor: string;
  borderStyle: string;
  data: Requirement;
  constructor(requirement: Requirement) {
    super(requirement.name);
    //console.log(requirement);
    this.id = requirement.id;
    this.borderStyle = '2px solid #000000';
    this.backgroundColor = getColorByLevel(requirement.level);
    this.selected = false;
    this.data = requirement;
  }
}
