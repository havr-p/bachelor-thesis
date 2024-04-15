import { ClassicPreset } from 'rete';
import { Requirement } from '../models/requirement';
import { getColorByLevel } from '../utils';

export class RequirementItem extends ClassicPreset.Node {
  width = 400;
  height = 200;
  backgroundColor: string;
  borderStyle: string;
  requirement: Requirement;
  constructor(requirement: Requirement) {
    super(requirement.name);
    //console.log(requirement);
    this.requirement = requirement;
    this.id = requirement.id;
    this.borderStyle = '2px solid #000000';
    this.backgroundColor = getColorByLevel(requirement.level);
    this.selected = false;
  }

  // execute() {}
  //  data() {
  //    return this.requirement;
  //  }
}
