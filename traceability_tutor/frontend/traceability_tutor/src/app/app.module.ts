import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomSocketComponent } from './customization/custom-socket/custom-socket.component';
import { CustomNodeComponent } from './customization/custom-node/custom-node.component';
import { CustomConnectionComponent } from './customization/custom-connection/custom-connection.component';

import { ReteModule } from 'rete-angular-plugin/17';
import { DockComponent } from './dock/dock.component';
import {MenubarModule} from "primeng/menubar";
import {DialogModule} from "primeng/dialog";
import {FileUploadModule} from "primeng/fileupload";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomNodeComponent,
    CustomConnectionComponent,
    DockComponent,
  ],
    imports: [BrowserModule, ReteModule, MenubarModule, DialogModule, FileUploadModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
