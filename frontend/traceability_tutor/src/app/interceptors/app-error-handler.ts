import {ErrorHandler, Injectable} from "@angular/core";
import {EventService} from "../services/event/event.service";

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  constructor(private eventService: EventService) {
  }
  handleError(error: any) {
    const err = new Error(error);
    this.eventService.notify(err.message, 'error');
    throw err;
  }
}
