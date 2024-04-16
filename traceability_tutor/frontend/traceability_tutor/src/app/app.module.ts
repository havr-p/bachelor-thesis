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
import { TraceabilityEditorComponent } from './ui/traceability-editor/traceability-editor.component';
import { RequirementItemComponent } from './ui/items/requirement-item/requirement-item.component';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { SpeedDialModule } from 'primeng/speeddial';
import { ItemInfoViewComponent } from './ui/item-info-view/item-info-view.component';
import { SharedModule } from './shared/shared.module';
import { ReteModule } from 'rete-angular-plugin/17';

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomConnectionComponent,
    DockComponent,
    TraceabilityEditorComponent,
    RequirementItemComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
