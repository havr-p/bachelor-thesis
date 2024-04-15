import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';
import { RequirementItem } from '../../items/requirementItem';

@Component({
  selector: 'connection',
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" />
    </svg>
  `,
  styleUrls: ['./custom-connection.component.sass'],
})
export class CustomConnectionComponent {
  @Input() data!: ClassicPreset.Connection<RequirementItem, RequirementItem>;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;
}
