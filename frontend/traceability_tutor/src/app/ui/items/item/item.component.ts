import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {ItemNode} from '../../../items/item-node';
import {EventService} from '../../../services/event/event.service';

@Component({
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass'],
  host: {
    'data-testid': 'node',
  },
})
export class ItemComponent implements OnChanges, OnInit {
  @Input() data!: ItemNode;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;
  shortLabel: string = '';

  seed = 0;

  @HostBinding('class.selected') get selected() {
    return this.data.selected;
  }

  @HostBinding('class.highlighted') get highlighted() {
    return this.data.highlighted;
  }

  @HostListener('click', ['$event']) onClick(btn: any) {
    this.data.selected = true;
  }

  @HostBinding('style.background-color') backgroundColor: string = '#fff';


  constructor(
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
  ) {
    this.cdr.detach();
  }

  ngOnInit(): void {
    this.updateShortLabel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.backgroundColor = this.data.backgroundColor || '#fff';
      this.updateShortLabel();

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

  updateShortLabel() {
    const label = this.data.label || '';
    if (label.length > 90) {
      this.shortLabel = label.substring(0, 90) + '...';
    } else {
      this.shortLabel = label;
    }
  }

}
