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
import { InplaceModule } from 'primeng/inplace';
import { FormsModule } from '@angular/forms';
import { Item } from '../../items/Item';
import { ItemType } from '../../types';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-item-info-view',
  templateUrl: './item-info-view.component.html',
  styleUrl: './item-info-view.component.sass',
  standalone: true,
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
    InputTextModule,
    InputTextareaModule,
  ],
})
export class ItemInfoViewComponent {
  @Input() item!: Item;
  constructor(private eventService: EventService) {}

  protected readonly ItemType = ItemType;
  dataChanged = false;

  // ngOnInit(): void {
  //   this.eventService.event$.subscribe(async (event: AppEvent) => {
  //     if (event.context?.invokedFrom == EventSource.EDITOR) {
  //       const type = event.context.eventType;
  //       switch (type) {
  //         case EditorEvent.ADD_CONNECTION:
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   });
  // }
}
