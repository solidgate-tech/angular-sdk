import { Component } from '@angular/core';
import {MessageType, SdkMessage, InitConfig } from "@solidgate/angular-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  merchantData: InitConfig['merchantData'] = {
    "merchant": "<--YOUR DATA-->",
    "signature": "<--YOUR DATA-->",
    "paymentIntent": "<--YOUR DATA-->>"
  }

  formParams: InitConfig['formParams'] = {}

  googlePayParams = {
    color: 'white'
  }

  log(event: SdkMessage[MessageType]) {
    console.log(event.type, event)
  }
}
