import { Component } from '@angular/core';
import {TuiReorderModule} from "@taiga-ui/addon-table";
import {OrderListModule} from "primeng/orderlist";

@Component({
  selector: 'app-level-list',
  standalone: true,
  imports: [
    OrderListModule
  ],
  templateUrl: './level-list.component.html',
  styleUrl: './level-list.component.scss'
})
export class LevelListComponent {

  items: readonly string[] = [
    'John Cleese',
    'Eric Idle',
    'Michael Palin',
    'Terry Gilliam',
    'Terry Jones',
    'Graham Chapman',
  ];
  enabled = this.items;
  levels: any;

}
