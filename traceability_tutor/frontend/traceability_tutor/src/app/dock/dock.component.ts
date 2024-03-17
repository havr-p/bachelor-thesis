import {Component, OnInit} from '@angular/core';
import {FileUploadEvent} from "primeng/fileupload";
import { InputTextModule } from 'primeng/inputtext';
import {RequirementsService} from "../../services/requirements/requirements.service";

interface RequirementField {
  field_value: any; // Replace 'any' with a more specific type as needed
}
@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss'
})
export class DockComponent implements OnInit {
  menubarItems: any[] | undefined;

  constructor(private requirementsService: RequirementsService) {
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


  private loadAll() {
    this.requirementsService.fetchRequirements().then((requirements) => {


   // Example of processing the requirements if necessary
       console.log(requirements);
 }).catch((error) => {
   console.error('Error fetching requirements:', error);
 });
  }
}



