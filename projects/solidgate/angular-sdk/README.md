# Solidgate Angular SDK

This repository is an Angular wrapper for the Solidgate Client Software Development Kit (SDK).

Check our
* <a href="https://docs.solidgate.com/" target="_blank">Payment guide</a> to understand business value better
* <a href="https://api-docs.solidgate.com/" target="_blank">API Reference</a> to find more examples of usage

## Structure

<table>
  <tr>
    <th>SDK for Angular contains</th>
    <th>Table of contents</th>
  </tr>
  <tr>
    <td>
      <code>projects/solidgate/</code> – source for the Angular library (SDK)<br>
      <code>dist</code> – compiled build output<br>
      <code>angular.json</code> – Angular CLI configuration<br>
      <code>package.json</code> – project metadata and dependency definitions
    </td>
    <td>
      <a href="https://github.com/solidgate-tech/angular-sdk/tree/master/projects/solidgate/angular-sdk#installation">Installation</a><br>
      <a href="https://github.com/solidgate-tech/angular-sdk/tree/master/projects/solidgate/angular-sdk#usage">Usage</a><br>
      <a href="https://github.com/solidgate-tech/angular-sdk/tree/master?tab=readme-ov-file#development-server">Development server</a><br>
      <a href="https://github.com/solidgate-tech/angular-sdk/tree/master?tab=readme-ov-file#build">Build</a>
    </td>
  </tr>
</table>

<br>

## Installation

Run the following command in your Angular project:

```
npm install --save @solidgate/angular-sdk
```

<br>

## Usage

### Payment form

#### Module Setup

Add `SolidPaymentModule` to your feature (or app module):

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

#### Basic Usage

To render a payment form component:

```typescript
import { Component } from '@angular/core';
import { InitConfig, SdkMessage, MessageType, ClientSdkInstance } from '@solidgate/angular-sdk';

@Component({
  selector: 'app-payment',
  template: `
    <ngx-solid-payment
      [merchantData]="merchantData"
      (mounted)="onMounted($event)"
      (success)="onSuccess($event)"
      (fail)="onFail($event)"
      (error)="onError($event)"
    ></ngx-solid-payment>
  `
})
export class PaymentComponent {
  // For merchantData structure and generation, see:
  // https://docs.solidgate.com/payments/integrate/payment-form/create-your-payment-form/
  merchantData: InitConfig['merchantData'] = {
    merchant: 'YOUR_MERCHANT_ID',
    signature: 'YOUR_SIGNATURE',
    paymentIntent: 'YOUR_PAYMENT_INTENT'
  };

  // For complete list of callbacks and their usage, see:
  // https://docs.solidgate.com/payments/integrate/payment-form/create-your-payment-form/
  onMounted(event: SdkMessage[MessageType.Mounted]): void {}
  onSuccess(event: SdkMessage[MessageType.Success]): void {}
  onFail(event: SdkMessage[MessageType.Fail]): void {}
  onError(event: SdkMessage[MessageType.Error]): void {}
}
```

For detailed information about `merchantData` structure, available callbacks, configuration options, and mobile responsiveness, refer to the [Payment guide](https://docs.solidgate.com/payments/integrate/payment-form/create-your-payment-form/).

#### Custom Container for Payment Buttons

To render Google Pay, Apple Pay, or PayPal buttons in custom containers:

```angular2html
<ngx-solid-payment
  [merchantData]="merchantData"
  [googlePayContainer]="googlePayContainer"
  [applePayContainer]="applePayContainer"
  [paypalContainer]="paypalContainer"
></ngx-solid-payment>

<div #googlePayContainer></div>
<div #applePayContainer></div>
<div #paypalContainer></div>
```

To render Pix, Pix QR, Bizum, Blik, or MB WAY buttons in custom containers:

```angular2html
<ngx-solid-payment
  [merchantData]="merchantData"
  [pixContainer]="pixContainer"
  [pixQrContainer]="pixQrContainer"
  [bizumContainer]="bizumContainer"
  [blikContainer]="blikContainer"
  [mbwayContainer]="mbwayContainer"
></ngx-solid-payment>

<div #pixContainer></div>
<div #pixQrContainer></div>
<div #bizumContainer></div>
<div #blikContainer></div>
<div #mbwayContainer></div>
```

#### Custom Submit Flow

To use your own submit button, disable the form button through `formParams`:

```typescript
formParams: InitConfig['formParams'] = {
  allowSubmit: false
}
```

Then subscribe to the SDK instance and use the `submit` method:

```angular2html
<ngx-solid-payment
  [merchantData]="merchantData"
  [formParams]="formParams"
  (readyPaymentInstance)="sdkInstance = $event"
  (interaction)="isFormValid = $event.isValid"
></ngx-solid-payment>

<button 
  *ngIf="sdkInstance" 
  (click)="sdkInstance?.submit()"
  [disabled]="!isFormValid"
>
  Submit Payment
</button>
```

For complete information about available callbacks, configuration options, and mobile responsiveness, refer to the [Payment guide](https://docs.solidgate.com/payments/integrate/payment-form/create-your-payment-form/).

### Resign form

#### Module Setup

Add `SolidResignModule` to your feature (or app module):

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

#### Basic Usage

To render a resign payment form component:

```typescript
import { Component } from '@angular/core';
import { ResignRequest, SdkMessage, MessageType } from '@solidgate/angular-sdk';

@Component({
  selector: 'app-resign',
  template: `
    <ngx-solid-resign
      [resignRequest]="resignRequest"
      (mounted)="onMounted($event)"
    ></ngx-solid-resign>
  `
})
export class ResignComponent {
  // For resignRequest structure and generation, see:
  // https://docs.solidgate.com/payments/integrate/payment-form/resign-payment-form/
  resignRequest: ResignRequest = {
    merchant: 'YOUR_MERCHANT_ID',
    signature: 'YOUR_SIGNATURE',
    resignIntent: 'YOUR_RESIGN_INTENT'
  };

  onMounted(event: SdkMessage[MessageType.Mounted]): void {}
}
```

For detailed information about `resignRequest` structure, configuration options, and available callbacks, refer to the [Resign payment form documentation](https://docs.solidgate.com/payments/integrate/payment-form/resign-payment-form/).

#### Custom Submit Flow

The handling of the custom submit flow is identical to that of the payment form, with the exception of the event name that passes the SDK instance:

```typescript
import { ResignFormConfig } from '@solidgate/angular-sdk'

resignFormConfig: ResignFormConfig = {
  appearance: {
    allowSubmit: false
  }
}
```

```angular2html
<ngx-solid-resign
  [resignRequest]="resignRequest"
  [appearance]="resignFormConfig.appearance"
  (interaction)="isFormValid = $event.isValid"
  (readyResignInstance)="sdkInstance = $event"
></ngx-solid-resign>

<button 
  *ngIf="sdkInstance" 
  (click)="sdkInstance?.submit()"
  [disabled]="!isFormValid"
>
  Submit
</button>
```

## Development

To set up the development server:

1. Navigate to the project root directory:

   ```bash
   cd angular-sdk
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run serve:example
   ```

4. Open your browser and navigate to `http://localhost:4200/`.

## Build

To build the SDK:

1. Navigate to the project root directory:

   ```bash
   cd angular-sdk
   ```

2. Run the build command:

   ```bash
   npm run build:sdk
   ```

3. The build artifacts will be stored in the `dist/` directory.

---

Looking for help? <a href="https://support.solidgate.com/support/tickets/new" target="_blank">Contact us</a> <br>
Want to contribute? <a href="https://github.com/solidgate-tech/angular-sdk/pulls" target="_blank">Submit a pull request</a>
