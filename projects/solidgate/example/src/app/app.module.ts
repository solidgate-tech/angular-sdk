import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SolidPaymentModule, SolidResignModule } from "@solidgate/angular-sdk";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SolidPaymentModule,
    SolidResignModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
