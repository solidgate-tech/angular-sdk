import {Component} from '@angular/core';

import {FormType, InitConfig, MessageType, SdkMessage} from "@solidgate/angular-sdk";

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

  formParams: InitConfig['formParams'] = {
    formTypeClass: FormType.Default
  }

  googlePayParams = {
    color: 'white'
  }

  log(event: SdkMessage[MessageType]) {
    console.log(event.type, event)
  }

  changeTemplate() {
    if (!this.formParams) {
      return
    }

    this.formParams.formTypeClass = this.formParams.formTypeClass === FormType.Default
      ? FormType.Card
      : FormType.Default
  }
}
