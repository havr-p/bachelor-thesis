import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BaseEvent,
  EditorEvent,
  EditorEventType,
  EventSource,
  ItemViewEvent,
  ItemViewEventType,
} from '../../types';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSource = new Subject<BaseEvent<EventSource, any>>();
  event$ = this.eventSource.asObservable();

  constructor(private toastr: ToastrService) {}

  publishEditorEvent(type: EditorEventType, data?: any) {
    console.log('publishEditorEvent', type, data);
    this.eventSource.next(new EditorEvent(type, data));
  }

  publishItemViewEvent(type: ItemViewEventType, data: any) {
    this.eventSource.next(new ItemViewEvent(type, data));
  }

  notify(message: string, type: 'success' | 'error' | 'info' | 'warning', title?: string, override?:  Partial<IndividualConfig<any>>) {
    switch (type) {
      case 'success':
        this.toastr.success(message, title, override);
        break;
      case 'error':
        this.toastr.error(message, title, override);
        break;
      case 'info':
        this.toastr.info(message, title, override);
        break;
      case 'warning':
        this.toastr.warning(message, title, override);
        break;
      default:
        this.toastr.show(message, title, override);
        break;
    }
  }
}
