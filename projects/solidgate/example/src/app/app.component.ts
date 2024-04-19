import {Component} from '@angular/core';

import {
  FormType,
  InitConfig,
  MessageType,
  SdkMessage,
  ResignRequest,
  ResignFormConfig
} from "@solidgate/angular-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isResignFlow: boolean = false;

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

  resignRequest: ResignRequest = {
    "merchant": "<--YOUR DATA-->",
    "signature": "<--YOUR DATA-->",
    "resignIntent": "<--YOUR DATA-->>"
  }

  resignFormConfig?: ResignFormConfig;

  log(event: SdkMessage[MessageType]) {
    console.log(event.type, event)
  }

  logError(event: Error) {
    console.log(event)
  }

  changePaymentFormTemplate() {
    if (!this.formParams) {
      return
    }

    this.formParams.formTypeClass = this.formParams.formTypeClass === FormType.Default
      ? FormType.Card
      : FormType.Default
  }

  changeResignFormConfig () {
    if (!this.resignFormConfig) {
      this.resignFormConfig = {
        appearance: {
          submitButtonText: 'Custom submit text',
          allowSubmit: true,
          googleFontLink: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap',
          resignCvvLabel: 'CVC',
          resignCvvPlaceholder: '123',
          hideCvvNumbers: false
        },
        container: {
          width: '500px'
        },
        styles: {
          "resign-cvv": {
            ".resign-label": {
              "display": "block"
            }
          }
        }
      }
    } else {
      this.resignFormConfig = undefined;
    }
  }
}
