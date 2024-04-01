import { ClassicPreset } from 'rete';
import { NodeProps } from './types';
import { Subject } from 'rxjs';

// export class Connection<
//   A extends NodeProps,
//   B extends NodeProps
// > extends ClassicPreset.Connection<A, B> {
//   //isLoop?: boolean;
//   label?: string;
// }

export class Connection<
  A extends NodeProps,
  B extends NodeProps,
> extends ClassicPreset.Connection<A, B> {
  isSelected?: boolean;
  private changes = new Subject<any>();
  changes$ = this.changes.asObservable();
  updateData(data: any) {
    this.isSelected = data.isSelected;
    this.changes.next(data);
  }
}
