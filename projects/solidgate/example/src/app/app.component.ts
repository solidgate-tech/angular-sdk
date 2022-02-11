import { Component } from '@angular/core';
import {MessageType, SdkMessage, InitConfig } from "@solidgate/angular-sdk";
import { SdkLoader } from "@solidgate/client-sdk-loader";

SdkLoader.load()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  enabled = false
  merchantData: InitConfig['merchantData'] = {
    "merchant": "betterme_mid_test",
    "signature": "ODMxZmZiOTUwYzI2NjkxZmE1ZDc5ODYwOTZiNDk2NDkzMjM2YTY2ZTA5ZWI5MTFmZDVjMGU3NDgwYzA4MTE0NWE4OWY4NTUzZTNlNDcwYTI1ODAxOGZmMzI0NzFmNWQ5OTk5YmJjMTMxZGNhNWZkMDNjZmMzMmY4NzFhOGI5Njc=",
    "paymentIntent": "9FFMTw4W5GA5bpnfJdTyEiyn1gESauG-LCnFVTThTvLyCj3ZkDdgwv0JtIavZ1eXwNkgvWmlGFK8EvzYRV8fdNgpnJvXAsZFDQBTRhdoKD14rhRyi7XzMtksDNf2nft1ZEhX9kGK-WSOJQfTIWR1VocJTBP3lapNa_RBo78Yq3tRghCzX9duCkD7uTAGSFY2RzpCzrmuEWqg0DztZFq3cj_VovDzYepKb3Tg6Vwfn7iSV4ygJj8cMJTKWyZawlwTFWjTO04ST11InVAItDwYVVhPlHUcij6SmIU54egXutlBEHMrQHPpwPW4jjT4_Jy31SyP_w-dY0mceIHjKqoCoDm6jidjaK7CtxvfT59SigiveTMRFER-TkAQp7xwNtqKu8JNkdZqtMjVXaiZQoWJqX09NJOWrvn3AwvXmMYDZSkpfoe_XwmJOh-Vyf4GMVmk-FaEvqpSiDsi7dJ69h_ZWTcS44nYyNzvQTol0UD0n02E5mDQqsRj_0yrwByyG5y072sImNOkfRLiz74uA9x9GvzZH7PIH3swCX7cWqjwh5w="
  }

  formParams: InitConfig['formParams'] = {
    enabled: false
  }

  googlePayParams = {
    color: 'white'
  }

  log(event: SdkMessage[MessageType]) {
    console.log(event.type, event)
  }

  ngOnInit() {
    setTimeout(() => {
      console.log('show')
      this.enabled = true
    }, 3000)
  }
}
