import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RequirementItem } from '../../../items/requirementItem';
import { EventService } from '../../../../services/event.service';
import { MenuItem } from 'primeng/api';

@Component({
  templateUrl: './requirement-node.component.html',
  styleUrls: ['./requirement-node.component.sass'],
  host: {
    'data-testid': 'node',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class RequirementItemComponent implements OnChanges, OnInit {
  @Input() data!: RequirementItem;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  nodeActions: MenuItem[] = [];
  displaySpeedDial = false;

  @HostBinding('class.selected') get selected() {
    // console.log(this.data.selected, this.data.label);
    return this.data.selected;
  }

  // @HostListener('click', ['$event']) onClick(btn: any) {
  //   console.log('clicked', btn);
  //   this.data.selected = !this.data.selected;
  //   this.eventService.publishEditorEvent(EditorEvent.SELECT, this.data);
  // }
  // @HostListener('hover') onHover() {
  //   this.displaySpeedDial = true;
  // }

  @HostBinding('style.background-color') backgroundColor: string = '#fff';
  onMouseEnter() {
    console.log(this.data.requirement.name);
    this.displaySpeedDial = true;
    console.log('displaySpeedDial', this.displaySpeedDial);
  }
  onMouseLeave() {
    console.log(this.data.requirement.name);
    this.displaySpeedDial = false;
    console.log('displaySpeedDial', this.displaySpeedDial);
  }

  @HostBinding('style.border') get borderColorStyle(): string {
    return this.data.selected ? '4px solid red' : this.data.borderStyle;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
  ) {
    this.cdr.detach();
  }

  ngOnInit(): void {
    this.nodeActions = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          console.log('Edit');
        },
        tooltipOptions: {
          tooltipLabel: 'Edit node',
          tooltipPosition: 'bottom',
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => {
          console.log('Delete');
        },
        tooltipOptions: {
          tooltipLabel: 'Delete node',
          tooltipPosition: 'bottom',
        },
      },
    ];
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

  protected readonly localStorage = localStorage;
  onSpeedDialClick(event: any) {
    console.log('onSpeedDialClick');
  }
}
