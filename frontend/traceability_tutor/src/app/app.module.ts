import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomSocketComponent } from './customization/custom-socket/custom-socket.component';

import { CustomConnectionComponent } from './customization/custom-connection/custom-connection.component';

import { DockComponent } from './ui/dock/dock.component';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe, NgForOf, NgOptimizedImage } from '@angular/common';
import { RequirementItemComponent } from './ui/items/requirement-item/requirement-item.component';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { SpeedDialModule } from 'primeng/speeddial';
import { ItemInfoViewComponent } from './ui/item-info-view/item-info-view.component';
import { SharedModule } from './shared/shared.module';
import { ReteModule } from 'rete-angular-plugin/17';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrModule } from 'ngx-toastr';
import {AuthComponent} from "./ui/auth/auth.component";
import { LoginFormComponent } from './ui/login-form/login-form.component';
import {TabViewModule} from "primeng/tabview";
import {InputTextModule} from "primeng/inputtext";
import {EditorComponent} from "./ui/editor/editor.component";
import {CreateProjectFormComponent} from "./ui/forms/create-project.form/create-project.form.component";
import { EditorWrapperComponent } from './ui/editor-wrapper/editor-wrapper.component';
import {provideRouter} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomConnectionComponent,
    DockComponent,
    EditorComponent,
    RequirementItemComponent,
    EditorWrapperComponent,
  ],
  imports: [
    BrowserModule,
    MenubarModule,
    DialogModule,
    FileUploadModule,
    FormsModule,
    KeyValuePipe,
    NgForOf,
    SharedModule,
    NgOptimizedImage,
    PanelModule,
    ItemInfoViewComponent,
    BrowserAnimationsModule,
    SidebarModule,
    SpeedDialModule,
    ReteModule,
    ProgressSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AuthComponent,
    TabViewModule,
    InputTextModule,
    LoginFormComponent,
    CreateProjectFormComponent,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule {}
