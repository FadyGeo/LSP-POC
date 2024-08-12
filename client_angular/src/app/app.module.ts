import "reflect-metadata"
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MaterialModule } from './Modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TutorKaiModule } from './Modules/tutor-kai/tutor-kai.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TutorKaiModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxExtendedPdfViewerModule,
    HttpClientModule,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    EditorModule,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
