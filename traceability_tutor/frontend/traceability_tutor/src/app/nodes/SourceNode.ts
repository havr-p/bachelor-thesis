import { ClassicPreset } from 'rete';
import { getColorByLevel } from '../utils';

export class SourceNode extends ClassicPreset.Node {
  width = 400;
  height = 200;
  backgroundColor = 'blue';
  borderStyle: string;
  //requirement: Requirement;
  constructor() {
    super('Source');
    //console.log(requirement);
    // this.requirement = requirement;
    // this.id = requirement.id;
    this.borderStyle = '2px solid #000000';
    //this.backgroundColor = getColorByLevel(requirement.level);
    this.selected = false;
  }

  // execute() {}
  //  data() {
  //    return this.requirement;
  //  }
}
