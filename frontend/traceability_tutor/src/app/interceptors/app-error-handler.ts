import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {EventService} from "../services/event/event.service";

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    const eventService = this.injector.get(EventService); // Get dynamically
    const err = new Error(error);
    eventService.notify(err.message, 'error');
    throw err;
  }
}
