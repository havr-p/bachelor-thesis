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

import { SharedModule } from './shared/shared.module';
import { ReteModule } from 'rete-angular-plugin/17';
import { TraceabilityEditorComponent } from './ui/traceability-editor/traceability-editor.component';
import { RequirementNodeComponent } from './customization/requirement-node/requirement-node.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomConnectionComponent,
    DockComponent,
    RequirementNodeComponent,
    TraceabilityEditorComponent,
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
    ReteModule,
    NgOptimizedImage,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
