import {Injectable} from '@angular/core';
import {shareReplay, Subject} from 'rxjs';
import {
    BaseEvent,
    EditorEvent,
    EditorEventType,
    EventSource, ItemEvent, ItemEventType,
    ItemViewEvent,
    ItemViewEventType,
    ProjectEvent,
    ProjectEventType,
} from '../../types';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    private eventSource = new Subject<BaseEvent<EventSource, any>>();
    event$ = this.eventSource.asObservable().pipe(shareReplay(1));

    constructor(private toastr: ToastrService) {
    }

    publishEditorEvent(type: EditorEventType, payload?: any) {
        //console.log('publishEditorEvent', type, payload);
        this.eventSource.next(new EditorEvent(type, payload));
    }

    publishItemViewEvent(type: ItemViewEventType, payload: any) {
        this.eventSource.next(new ItemViewEvent(type, payload));
    }

    publishProjectMenuEvent(type: ProjectEventType, payload?: any) {
        //console.log('publishProjectMenuEvent', type, payload);
        this.eventSource.next(new ProjectEvent(type, payload));
    }
    publishItemEvent(type: ItemEventType, payload?: any) {
        //console.log('publishItemEvent', type, payload);
        this.eventSource.next(new ItemEvent(type, payload));
    }

    notify(message: string, type: 'success' | 'error' | 'info' | 'warning', title?: string,
           override: Partial<IndividualConfig> = {enableHtml: true}) {
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
    clearToasts() {
        this.toastr.clear();
    }
}
