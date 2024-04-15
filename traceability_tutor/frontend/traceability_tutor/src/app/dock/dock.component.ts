import {Component, OnInit} from '@angular/core';
import {FileUploadEvent} from "primeng/fileupload";
import { InputTextModule } from 'primeng/inputtext';

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
    fetchRequirements().then((requirements) => {
  // Example of processing the requirements if necessary
      console.log(requirements);
}).catch((error) => {
  console.error('Error fetching requirements:', error);
});
  }
}
async function fetchRequirements(): Promise<Requirement[]> {
   const response = await fetch('http://localhost:5555/json_all');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const rawData: string[][] = await response.json();
  const requirements: Requirement[] = rawData.map((item) => ({
    id: item[0],
    category: item[1],
    status: item[2], // This will be `undefined` for items without a status, which is fine for an optional property
  }));
  return requirements;
}

interface Requirement {
  id: string;
  category: string;
  status?: string; // Marked as optional since some items don't have a status
}
