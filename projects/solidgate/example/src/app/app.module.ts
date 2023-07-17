import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SolidPaymentModule } from "@solidgate/angular-sdk";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SolidPaymentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
