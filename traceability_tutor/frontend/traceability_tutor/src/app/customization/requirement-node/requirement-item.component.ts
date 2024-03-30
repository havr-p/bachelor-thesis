import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RequirementItem } from '../../items/requirementItem';

@Component({
  templateUrl: './requirement-item.component.html',
  styleUrls: ['./requirement-item.component.sass'],
  host: {
    'data-testid': 'item',
  },
})
export class RequirementItemComponent implements OnChanges {
  @Input() data!: RequirementItem;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  @HostBinding('class.selected') get selected() {
    // console.log(this.data.selected, this.data.label);
    return this.data.selected;
  }

  @HostListener('click') onClick() {
    this.data.selected = !this.data.selected;
  }

  @HostBinding('style.background-color') backgroundColor: string = '#fff';
  @HostBinding('style.border') get borderColorStyle(): string {
    return this.data.selected ? '4px solid red' : this.data.borderStyle;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.backgroundColor = this.data.backgroundColor || '#fff';
    }
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
  }

  sortByIndex(a: any, b: any) {
    const ai = a.value.index || 0;
    const bi = b.value.index || 0;

    return ai - bi;
  }
}
