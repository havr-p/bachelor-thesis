import {Component, OnInit} from '@angular/core';
import {FileUploadEvent} from "primeng/fileupload";
import { InputTextModule } from 'primeng/inputtext';
import {RequirementsService} from "../../services/requirements/requirements.service";
import {EventService} from "../../services/event.service";
import {filter} from "rxjs";
import {Requirement} from "../models/requirement";


@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss'
})
export class DockComponent implements OnInit {
  menubarItems: any[] | undefined;
  id = 1;

  constructor(private requirementsService: RequirementsService, private eventService: EventService) {
  }
   ngOnInit() {
     this.menubarItems = [
       {
             label: 'New',
             icon: 'pi pi-fw pi-plus',
             items: [

               {
                 label: 'Project',
                 icon: 'pi pi-fw pi-video',
                 command: () => {
                    this.loadAll();
                }
               }
             ]
           },
        {
                 label: 'Demo',
                 icon: 'pi pi-fw pi-video',
                 command: () => {
                    this.loadAll();
                }
                },
           // {
           //   label: 'Delete',
           //   icon: 'pi pi-fw pi-trash'
           // },

           // {
           //   label: 'Export',
           //   icon: 'pi pi-fw pi-external-link'
           // }


       // {
       //   label: 'Edit',
       //   items: [
       //     {
       //       label: 'Left',
       //       icon: 'pi pi-fw pi-align-left'
       //     },
       //     {
       //       label: 'Right',
       //       icon: 'pi pi-fw pi-align-right'
       //     },
       //     {
       //       label: 'Center',
       //       icon: 'pi pi-fw pi-align-center'
       //     },
       //     {
       //       label: 'Justify',
       //       icon: 'pi pi-fw pi-align-justify'
       //     }
       //   ]
       // },

       {
         label: 'Quit'
       }
     ];

   }

  protected readonly Date = Date;
  createNewProjectDialogVisible = false;
  uploadedFiles: any;
  value: any;

  private createNewProject() {

  }

  onUpload($event: FileUploadEvent) {

  }


  private async loadAll(): Promise<Requirement[]> {
  try {
    // Await the promise from fetchRequirements and return its result directly
    const requirements = await this.requirementsService.fetchRequirements();
    // Process requirements if necessary
    // console.log(requirements);
    return requirements;
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return []; // Return an empty array in case of error
  }
}

  sendEventToEditor(eventData: any) {
    this.eventService.publishEditorEvent(eventData);
  }
}



