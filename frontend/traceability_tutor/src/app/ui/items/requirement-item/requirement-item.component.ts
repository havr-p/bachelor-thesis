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
import {RequirementItem} from '../../../items/requirement-item';
import {EventService} from '../../../services/event/event.service';

@Component({
  templateUrl: './requirement-item.component.html',
  styleUrls: ['./requirement-item.component.sass'],
  host: {
    'data-testid': 'node',
  },
})
export class RequirementItemComponent implements OnChanges, OnInit {
  @Input() data!: RequirementItem;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;
  shortLabel: string = '';

  seed = 0;

  @HostBinding('class.selected') get selected() {
    return this.data.selected;
  }

  @HostListener('click', ['$event']) onClick(btn: any) {
    this.data.selected = !this.data.selected;
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
