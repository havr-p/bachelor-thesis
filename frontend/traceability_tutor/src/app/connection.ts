import {ClassicPreset} from 'rete';
import {ItemProps} from './types';
import {Subject} from 'rxjs';
import {RelationshipDTO, RelationshipType} from "../../gen/model";

// export class Connection<
//   A extends NodeProps,
//   B extends NodeProps
// > extends ClassicPreset.Connection<A, B> {
//   //isLoop?: boolean;
//   label?: string;
// }

export class Connection<
  Source extends ItemProps,
  Target extends ItemProps,
> extends ClassicPreset.Connection<Source, Target> {
  selected?: boolean;
  relationshipData: RelationshipDTO;
  private changes = new Subject<any>();
  changes$ = this.changes.asObservable();

  constructor(source: Source, sourceOutput: keyof Source['outputs'], target: Target, targetInput: keyof Target['inputs'], relationshipData: RelationshipDTO) {
    super(source, sourceOutput, target, targetInput);
    this.relationshipData = relationshipData;
  }

  updateData(data: any) {
    this.relationshipData = data.relationshipData ?? this.relationshipData;
    this.selected = data.selected ?? this.selected;
    this.changes.next(data);
  }
}
