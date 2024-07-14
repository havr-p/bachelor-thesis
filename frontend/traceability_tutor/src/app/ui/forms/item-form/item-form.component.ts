import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {EventService} from "../../../services/event/event.service";
import {EditorService} from "../../../services/editor/editor.service";
import {StateManager} from "../../../models/state";
import {BaseEvent, EditorEventType, EventSource} from "../../../types";
import {ItemType} from "../../../../../gen/model";
import {Item} from "../../../models/itemMapper";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  standalone: true,
  imports: [
    InputTextareaModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    NgIf,
    NgForOf,
    DatePipe,
    ScrollPanelModule
  ]
})
export class ItemFormComponent implements OnInit, OnChanges {
  @Output() onItemCreate = new EventEmitter<any>();
  itemForm!: FormGroup;
  submitted = false;
  statuses: string[] = [];
  linksLabel: string = '';

  itemType!: ItemType;
  @Input() visible: boolean = false;
  @Input() formData: Item | undefined;
  @Output() formDataChange = new EventEmitter<Item>;
  @Input() mode: "create" | "update" = "create";

  constructor(private fb: FormBuilder,
              private eventService: EventService,
              public editorService: EditorService,
              private state: StateManager) {}

  ngOnInit(): void {
    this.initializeForm();
    this.eventService.event$.subscribe(
        async (event: BaseEvent<EventSource, EditorEventType>) => {
          if (event.source === EventSource.EDITOR) {
            switch (event.type) {
              case EditorEventType.ADD_ITEM:
                this.itemType = event.payload;
                this.editorService.setCreateItemType(event.payload);
                this.initializeForm();
                break;
              case EditorEventType.SELECT_ITEM:
                console.log("select item");
                break;
            }
          }
        }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.formData) {
      this.itemType = this.formData.itemType;
      this.initializeForm();
    }
  }

  initializeForm(): void {
    if (this.formData) {
      const linksArray = this.formData.data.links.map(link => this.fb.group({
        url: [link, Validators.required],
        addedAt: [new Date(), Validators.required]
      }));
      this.itemForm = this.fb.group({
        name: [this.formData.data.name, Validators.required],
        level: [this.formData.data.level, Validators.required],
        status: [this.formData.status, Validators.required],
        description: [this.formData.data.description || ''],
        links: this.fb.array(linksArray),
        newLink: ['']
      });
    } else {
      this.itemForm = this.fb.group({
        name: ['', Validators.required],
        level: ['', Validators.required],
        status: ['', Validators.required],
        description: [''],
        links: this.fb.array([]),
        newLink: ['']
      });
    }
    this.setLinksLabel();
    this.statuses = this.editorService.getStatuses(this.itemType);
  }

  private setLinksLabel(): void {
    switch (this.itemType) {
      case ItemType.DESIGN:
        this.linksLabel = 'Resources';
        break;
      case ItemType.CODE:
        this.linksLabel = 'Commits';
        break;
      case ItemType.TEST:
        this.linksLabel = 'Test reports';
        break;
      case ItemType.REQUIREMENT:
        this.linksLabel = 'Comments';
        break;
      default:
        this.linksLabel = 'Links';
    }
  }

  get links(): FormArray {
    return this.itemForm.get('links') as FormArray;
  }

  get newLinkPlaceholder(): string {
    switch (this.itemType) {
      case ItemType.DESIGN:
        return 'Add a new resource link';
      case ItemType.CODE:
        return 'Add a new VCS link';
      case ItemType.TEST:
        return 'Add a new test report link';
      case ItemType.REQUIREMENT:
        return 'Add a new comment';
      default:
        return 'Add a new link';
    }
  }

  addLink(): void {
    const newLinkControl = this.itemForm.get('newLink');
    if (newLinkControl && newLinkControl.value.trim() !== '') {
      this.links.push(this.fb.group({
        url: [newLinkControl.value, Validators.required],
        addedAt: [new Date(), Validators.required]
      }));
      newLinkControl.reset();
    }
  }

  clearLinks(): void {
    this.links.clear();
  }

  resetItemForm(): void {
    this.submitted = false;
    this.itemForm.reset();
    this.clearLinks();
  }

  createItem(): void {
    this.submitted = true;
    if (this.itemForm.valid) {
      const { newLink, ...formValueWithoutNewLink } = this.itemForm.value;
      const newItem = {
        ...formValueWithoutNewLink,
        itemType: this.itemType,
        projectId: this.state.currentProject?.id,
      };
      this.onItemCreate.emit(newItem);
      this.resetItemForm();
    }
  }

  prepareFormData(): void {
    this.submitted = true;
    if (this.itemForm.valid) {
      const { newLink, status, ...formValueWithoutNewLink } = this.itemForm.value;
      const updatedItem: Item = {
        ...this.formData!,
        data: {
          ...formValueWithoutNewLink
        },
        status: this.itemForm.get('status')!.value,
      };
      this.formData = updatedItem;
      this.formDataChange.emit(updatedItem);
      this.resetItemForm();
    }
  }
}
