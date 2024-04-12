import { Component, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Requirement } from '../../models/requirement';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import {
  NgForOf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { NodeType } from '../../types';
import { InplaceModule } from 'primeng/inplace';
import { Node } from '../../nodes/Node';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-node-info-view',
  templateUrl: './node-info-view.component.html',
  styleUrl: './node-info-view.component.sass',
  standalone: true,
  // animations: [
  //   trigger('slideInRight', [
  //     transition(':enter', [
  //       style({ transform: 'translateX(100%)' }),
  //       animate('500ms ease-out', style({ transform: 'translateX(0)' })),
  //     ]),
  //     transition(':leave', [
  //       animate('500ms ease-out', style({ transform: 'translateX(100%)' })),
  //     ]),
  //   ]),
  // ],
  imports: [
    PanelModule,
    EditorModule,
    DropdownModule,
    TableModule,
    NgSwitch,
    NgSwitchDefault,
    InplaceModule,
    NgSwitchCase,
    FormsModule,
    NgForOf,
  ],
})
export class NodeInfoViewComponent {
  @Input() node!: Node;
  requirement: Requirement = {
    id: '1',
    level: 'stakeholder',
    name: 'New Requirement',
    statement: 'New Requirement Description',
    references: [],
  };

  openReference(reference: any) {}

  protected readonly NodeType = NodeType;
}
