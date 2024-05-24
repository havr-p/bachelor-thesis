import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Connection } from '../../connection';
import { Subscription } from 'rxjs';
import { ItemNode } from '../../items/item-node';

@Component({
  selector: 'connection',
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" [ngClass]="{'selected': selected, 'highlight': highlighted}"/>
    </svg>
  `,
  styleUrls: ['./custom-connection.component.sass'],
})
export class CustomConnectionComponent implements OnInit, OnDestroy {
  @Input() data!: Connection<ItemNode, ItemNode>;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;

  @Input() selected = false;
  @Input() highlighted = false;
  private subscription: Subscription = new Subscription();

  @ViewChild('pathElement') pathElement!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.subscription = this.data.changes$.subscribe({
      next: (data: any) => {
        this.selected = data.selected ?? this.selected;
        this.highlighted = data.highlighted ?? this.highlighted;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
