import { ClassicPreset } from 'rete';
import { Node } from './Node';
import { NodeType } from '../types';

export class SourceNode extends ClassicPreset.Node implements Node {
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
    this.type = NodeType.SOURCE;
    // this.data = { commitId: '', commitMessage: '', commitDate: new Date() };
  }

  data: any;
  type: NodeType | undefined;

  // execute() {}
  //  data() {
  //    return this.requirement;
  //  }
}
