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
import {DockManager, DockMode} from "./dock-manager";
import {AuthService} from "../../services/auth/auth.service";

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
  @Input() mode: DockMode = 'editor';
  id = 1;

  constructor(private dockManager: DockManager, private stateManager: StateManager, private authService: AuthService) {
  }




  ngOnInit() {
    const menuItems = this.dockManager.buildMenuItems(this.mode);
    this.items.push(...menuItems);
    this.authService.currentUser.subscribe(user => {
      console.log("user in dock", user)
      const userMenuItems: MenuItem[] = [
        {
          label: user?.username,
          styleClass: 'user-menu',
          icon: 'pi pi-user',
          items: [{
            label: 'Logout',
            command: () => {
              this.authService.logout();
            },
            icon: 'pi pi-sign-out',
          }],
        }
      ];
      this.items.push(...userMenuItems);
    });
  }

}
