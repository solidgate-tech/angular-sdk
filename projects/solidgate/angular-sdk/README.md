# Solidgate Angular SDK

This is a wrapper for Solidgate Client SDK

## Installation

Run inside Angular project

```
ng add @solidagate/angular-sdk
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

### Development
Navigate to http://localhost:3000/. The app will automatically reload if you change any of the

In order to use angular-cli (which is required to build the project) you have to install at 
least v16.0.0 NodeJs

## Build

Run `npm run build:sdk` to build the project. The build artifacts will be stored in the `dist/`
directory.

## Development server

Run `npm run serve:example` for a dev server. Navigate to `http://localhost:4200/`. The app 
will automatically reload if you change any of the source files.

## Publish

Run `npm run publish`
