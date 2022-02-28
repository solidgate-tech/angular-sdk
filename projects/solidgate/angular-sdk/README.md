# Solidgate Angular SDK

This is a wrapper for Solidgate Client SDK

## Installation

Run inside Angular project

```
npm i @solidagate/angular-sdk
``` 

## Usage
Add SolidPaymentModule to your feature (or app module)
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SolidPaymentModule } from '@solidgate/angular-sdk';

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
```

Render a component

Component inputs and outputs are similar to described in the docs

https://dev.solidgate.com/developers/documentation/solid-payment-form

```angular2html
<ngx-solid-payment
    [merchantData]="merchantData"
    [googlePayButtonParams]="googlePayParams"
    (mounted)="log($event)"
    (interaction)="log($event)"
    (customStylesAppended)="log($event)"
    width="50%"
></ngx-solid-payment>
```

In order to render google/apple button in custom container pass link to container element

```angular2html
<ngx-solid-payment
    [merchantData]="merchantData"
    [googlePayContainer]="googlePay"
    [applePayContainer]="applePay"
></ngx-solid-payment>
<div #googleButton></div>
<div #appleButton></div>
```

To use your own submit flow disable form button trough formParams in your component

```typescript
import {InitConfig} from '@solidgate/angular-sdk'

formParams: InitConfig['formParams'] = {
  allowSubmit: false
}
```

Then subscribe to sdk instance and use `submit` method when you need it

```angular2html
<ngx-solid-payment
  [merchantData]="merchantData"
  [formParams]="formParams"
  (readyPaymentInstance)="sdkInstance = $event"
></ngx-solid-payment>

<button 
  *ngIf="!!sdkInstance" 
  (click)="sdkInstance?.submit()"
>
  Submit
</button>
```

If you need current validation state use `iteraction` event and cache it

