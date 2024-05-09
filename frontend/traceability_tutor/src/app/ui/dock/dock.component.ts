import {Component, Input, OnInit} from '@angular/core';
import {FileUploadEvent} from 'primeng/fileupload';
import {Requirement} from '../../models/requirement';
import {RequirementsService} from '../../services/requirements/requirements.service';
import {EventService} from '../../services/event/event.service';
import {LocalStorageService} from '../../services/local-storage/local-storage.service';
import {StateManager} from "../../models/state";
import {MenubarModule} from "primeng/menubar";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {DockManager} from "./dock-manager";

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss',
  imports: [
    MenubarModule,
    MenuModule,
    ButtonModule
  ],
  standalone: true
})
export class DockComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @Input() mode: 'projects' | 'releases' | 'editor' = 'editor';
  id = 1;

  constructor(private dockManager: DockManager, private stateManager: StateManager) {
  }




  ngOnInit() {
    const userMenuItems: MenuItem[] = [
      {
        label: this.stateManager.currentUser.email,
        styleClass: 'user-menu',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Logout',
            command: () => {
              this.stateManager.logout();
            },
            icon: 'pi pi-sign-out',
          },
        ],
      },
    ];
    const menuItems = this.dockManager.buildMenuItems(this.mode);
    this.items.push(...menuItems);
    this.items.push(...userMenuItems);
  }


}
