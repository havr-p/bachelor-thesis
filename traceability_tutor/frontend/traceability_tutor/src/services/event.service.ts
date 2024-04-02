import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {
private eventSource = new Subject<any>();
  event$ = this.eventSource.asObservable();

  publishEditorEvent(data: any) {
    this.eventSource.next(data);
  }
}
