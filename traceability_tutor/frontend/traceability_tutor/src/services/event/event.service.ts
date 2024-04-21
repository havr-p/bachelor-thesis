import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BaseEvent,
  EditorEvent,
  EditorEventType,
  EventSource,
  ItemViewEvent,
  ItemViewEventType,
} from '../../app/types';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSource = new Subject<BaseEvent<EventSource, any>>();
  event$ = this.eventSource.asObservable();

  publishEditorEvent(type: EditorEventType, data: any) {
    console.log('publishEditorEvent', type, data);
    this.eventSource.next(new EditorEvent(type, data));
  }

  publishItemViewEvent(type: ItemViewEventType, data: any) {
    this.eventSource.next(new ItemViewEvent(type, data));
  }
}
