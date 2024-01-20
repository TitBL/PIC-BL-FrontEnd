import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

// Modules
import { HttpClientModule } from '@angular/common/http';
import { ImportMaterialModule } from './modules/import-material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

/**MATERIAL */

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ImportMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
