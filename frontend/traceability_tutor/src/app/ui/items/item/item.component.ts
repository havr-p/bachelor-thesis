import {
  ChangeDetectorRef,
  Component, EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
} from '@angular/core';
import {ItemNode} from '../../../items/item-node';
import {EventService} from '../../../services/event/event.service';
import {BaseEvent, EditorEventType, EventSource, ItemEventType} from "../../../types";
import {Subscription} from "rxjs";

@Component({
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.sass'],
    host: {
        'data-testid': 'node',
    },
})
export class ItemComponent implements OnChanges, OnInit {
    @Input() data!: ItemNode;
    @Input() emit!: (data: any) => void;
    @Input() rendered!: () => void;
    shortLabel: string = '';

    seed = 0;
    @HostBinding('style.background-color') backgroundColor: string = '#fff';

    private subscriptions: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef,
        private eventService: EventService,
    ) {
        this.cdr.detach();
    }

    @HostBinding('class.selected') get selected() {
        return this.data.selected;
    }

    @HostBinding('class.highlighted') get highlighted() {
        return this.data.highlighted;
    }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    this.eventService.publishEditorEvent(EditorEventType.CHOOSE_SECOND_ITEM, { item: this.data, event });
    this.data.selected = true;
  }

    @HostListener('dblclick', ['$event']) onDblClick(btn: any) {
        this.eventService.publishEditorEvent(EditorEventType.SELECT_ITEM, this.data);
    }

    ngOnInit(): void {
        this.updateShortLabel();
        this.subscriptions.add(
            this.eventService.event$.subscribe(async (event: BaseEvent<EventSource, ItemEventType>) => {
                console.log('Event received:', event);
                if (event.source === EventSource.ITEM) {
                    if (event.type === ItemEventType.UPDATE_LABEL) {
                      if (this.data.id === event.payload.id)
                      this.shortLabel = event.payload.label;
                    }
                }
            }));
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

    sortByIndex(a: any, b: any) {
        const ai = a.value.index || 0;
        const bi = b.value.index || 0;

        return ai - bi;
    }

    updateShortLabel() {
        const label = this.data.label || '';
        if (label.length > 50) {
            this.shortLabel = label.substring(0, 50) + '...';
        } else {
            this.shortLabel = label;
        }
        this.cdr.detectChanges();
    }

}
