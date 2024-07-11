import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { InplaceModule } from 'primeng/inplace';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ItemType } from "../../../../gen/model";
import { NgxColorsModule } from "ngx-colors";
import { OrderListModule } from "primeng/orderlist";
import { TabViewModule } from "primeng/tabview";
import { EditorService } from "../../services/editor/editor.service";
import { ConnProps } from "../../types";
import { StateManager } from "../../models/state";
import { Item } from "../../models/itemMapper";
import {RelationshipTableComponent} from "../relationship-table/relationship-table.component";
import {ItemFormComponent} from "../forms/item-form/item-form.component";

@Component({
  selector: 'app-item-info-view',
  templateUrl: './item-info-view.component.html',
  styleUrls: ['./item-info-view.component.sass'],
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
    NgIf,
    NgxColorsModule,
    OrderListModule,
    ReactiveFormsModule,
    TabViewModule,
    RelationshipTableComponent,
    ItemFormComponent,
  ],
})
export class ItemInfoViewComponent implements AfterViewInit {
  @Input() item!: Item;
  @Output() toggleVisible = new EventEmitter<boolean>();
  @Output() viewInitialized = new EventEmitter<void>();
  @Output() onItemEdit = new EventEmitter<any>();
  @Input() editorService!: EditorService;
  relationships: ConnProps[] = [];
  protected readonly ItemType = ItemType;

  constructor(
      private cdr: ChangeDetectorRef,
      private state: StateManager,
  ) {
  }


  //todo use onItemEdit
  saveChanges() {

  }

  cancelChanges() {
    this.toggleVisible.emit(false);
  }

  ngAfterViewInit(): void {
    this.viewInitialized.emit();
    if (this.editorService && this.item) {
      this.relationships = this.editorService.getRelationships(this.item);
      console.log("relationships", this.relationships);
    }
    this.cdr.detectChanges();
  }


}
