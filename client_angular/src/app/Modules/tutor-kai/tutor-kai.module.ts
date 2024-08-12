import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorKaiRoutingModule } from './tutor-kai-routing.module';
import { TutorKaiComponent } from './tutor-kai.component';
import { StudentWorkspaceComponent } from './sites/student-workspace/student-workspace.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MarkdownModule } from 'ngx-markdown';

import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material.module';
import { CodeEditorComponent } from './sites/code-editor/code-editor.component';

@NgModule({
  declarations: [
    TutorKaiComponent,
    StudentWorkspaceComponent,
    CodeEditorComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    TutorKaiRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MarkdownModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  //providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ], Use hefl interceptor instead!
  bootstrap: [TutorKaiComponent],
})
export class TutorKaiModule {}
