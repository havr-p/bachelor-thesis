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
import { RequirementItem } from '../../items/requirement-item';

@Component({
  selector: 'connection',
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" [ngClass]="{'selected': isSelected, 'highlight': isHighlighted}"/>
    </svg>
  `,
  styleUrls: ['./custom-connection.component.sass'],
})
export class CustomConnectionComponent implements OnInit, OnDestroy {
  @Input() data!: Connection<RequirementItem, RequirementItem>;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;

  @Input() isSelected = false;
  @Input() isHighlighted = false;
  private subscription: Subscription = new Subscription();

  @ViewChild('pathElement') pathElement!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.subscription = this.data.changes$.subscribe({
      next: (data: any) => {
        this.isSelected = data.isSelected
        this.isHighlighted = data.isHighlighted
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
