# Solidgate Angular SDK

This is a wrapper for Solidgate Client SDK

## Installation

Run inside Angular project

```
npm i @solidagate/angular-sdk
``` 

## Usage

### Payment form

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

Component inputs and outputs are described in the docs

https://docs.solidgate.com/payments/integrate/payment-form/create-your-payment-form/

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
    [paypalContainer]="paypalButton"
></ngx-solid-payment>
<div #googleButton></div>
<div #appleButton></div>
<div #paypalButton></div>
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

### Resign form

Add SolidResignModule to your feature (or app module)
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SolidResignModule } from '@solidgate/angular-sdk';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SolidResignModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Render a component

Component inputs and outputs are described in the docs

https://docs.solidgate.com/payments/integrate/payment-form/resign-payment-form/

```angular2html
<ngx-solid-resign
  [resignRequest]="resignRequest"
  [appearance]="appearance"
  [container]="container"
  [styles]="styles"
  (mounted)="log($event)"
  (interaction)="log($event)"
></ngx-solid-resign>
```

The handling of the custom submit flow is identical to that of the payment form, with the exception of the event name that passes the SDK instance.

```typescript
import {ResignFormConfig} from '@solidgate/angular-sdk'

appearance: ResignFormConfig['appearance'] = {
  allowSubmit: false
}
```

```angular2html
<ngx-solid-resign
  [resignRequest]="resignRequest"
  [appearance]="appearance"
  (mounted)="log($event)"
  (interaction)="log($event)"
  (readyResignInstance)="sdkInstance = $event"
></ngx-solid-resign>

<button 
  *ngIf="!!sdkInstance" 
  (click)="sdkInstance?.submit()"
>
  Submit
</button>
```
