import {ClassicPreset} from 'rete';
import {ItemProps} from './types';
import {Subject} from 'rxjs';

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
  isSelected?: boolean;
  description?: string
  private changes = new Subject<any>();
  changes$ = this.changes.asObservable();

  constructor(source: Source, sourceOutput: keyof Source['outputs'], target: Target, targetInput: keyof Target['inputs'], description?: string) {
    super(source, sourceOutput, target, targetInput);
    this.description = description;
  }

  updateData(data: any) {
    this.description = data.description;
    this.isSelected = data.isSelected;
    this.changes.next(data);
  }
}
