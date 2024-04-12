import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EditorEvent } from '../app/types';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSource = new Subject<any>();
  event$ = this.eventSource.asObservable();

  publishEditorEvent(type: EditorEvent, data: any) {
    console.log('publishEditorEvent', type, data);
    this.eventSource.next({ type, data });
  }
}
