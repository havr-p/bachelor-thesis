import { Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {RequirementItem} from "../../items/requirement-item";

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

  seed = 0;
  shortLabel: string = '';

  @HostBinding('class.selected') get selected() {
    return this.data.selected;
  }

  @HostListener('click', ['$event']) onClick(btn: any) {
    this.data.selected = !this.data.selected;
  }

  @HostBinding('style.background-color') backgroundColor: string = '#fff';

  constructor(
      private cdr: ChangeDetectorRef,
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

  updateShortLabel() {
    const label = this.data.label || '';
    if (label.length > 30) {
      this.shortLabel = label.substring(0, 30) + '...';
    } else {
      this.shortLabel = label;
    }
  }

}
