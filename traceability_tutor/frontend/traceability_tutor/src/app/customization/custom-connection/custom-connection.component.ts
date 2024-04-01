import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RequirementNode } from '../../nodes/requirement.node';
import { Connection } from '../../connection';
import { Subscription } from 'rxjs';

@Component({
  selector: 'connection',
  template: `
    <svg data-testid="connection">
      <path
        #pathElement
        [attr.d]="path"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
      />
    </svg>
  `,
  styleUrls: ['./custom-connection.component.sass'],
})
export class CustomConnectionComponent implements OnInit, OnDestroy {
  @Input() data!: Connection<RequirementNode, RequirementNode>;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;

  @Input() strokeColor: string = 'black';
  @Input() strokeWidth: string = '15px';
  private subscription: Subscription = new Subscription();

  @ViewChild('pathElement') pathElement!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.subscription = this.data.changes$.subscribe({
      next: (data: any) => {
        console.log(data);
        this.strokeColor = data.isSelected ? 'red' : 'black';
        this.strokeWidth = data.isSelected ? '30px' : '15px';
        this.pathElement.nativeElement.strokeWidth = this.strokeWidth;
        this.pathElement.nativeElement.stroke = this.strokeColor;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
