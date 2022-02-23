import {from, Subscription, tap} from "rxjs";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output, ViewEncapsulation,
} from '@angular/core';

import {
  ClientSdk,
  ClientSdkInstance,
  ErrorMessage,
  FailMessage,
  InitConfig,
  InteractionMessage,
  Message,
  MessageType,
  MountedMessage,
  OrderStatusMessage,
  ResizeMessage,
  SdkLoader,
  SdkMessage,
  SubmitMessage,
  SuccessMessage,
} from "@solidgate/client-sdk-loader"

type ClientSdkEventsProvider = {
  [key in keyof SdkMessage]: EventEmitter<SdkMessage[key]>
}

interface PaymentElement {
  merchantData?: InitConfig['merchantData'] // required
  width?: string
  styles?: InitConfig['styles']
  formParams?: InitConfig['formParams']
  googlePayButtonParams?: Omit<InitConfig['googlePayButtonParams'], 'containerId'>
  applePayButtonParams?: Omit<InitConfig['applePayButtonParams'], 'containerId'>
}

@Component({
  selector: 'ngx-solid-payment',
  template: `
    <div [id]="id"></div>
  `,
  styles: [`
    ngx-solid-payment iframe {
      border: none;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolidPaymentComponent implements AfterViewInit, OnDestroy, ClientSdkEventsProvider, PaymentElement {
  private static Sdk$ = from(SdkLoader.load()).pipe(
    tap(sdk => SolidPaymentComponent.Sdk = sdk)
  )
  private static Sdk: ClientSdk | null = null

  public id = `${Math.random()}_${Date.now()}_solid_sdk`

  @Input() merchantData: PaymentElement['merchantData']
  @Input() width: PaymentElement['width']
  @Input() styles: PaymentElement["styles"]
  @Input() formParams: PaymentElement['formParams']
  @Input() googlePayButtonParams: PaymentElement['googlePayButtonParams']
  @Input() applePayButtonParams: PaymentElement['applePayButtonParams']
  @Input() applePayContainer: HTMLElement | undefined
  @Input() googlePayContainer: HTMLElement | undefined

  @Output() mounted = new EventEmitter<MountedMessage>()
  @Output() error = new EventEmitter<ErrorMessage>()
  @Output() fail = new EventEmitter<FailMessage>()
  @Output() orderStatus = new EventEmitter<OrderStatusMessage>()
  @Output() resize = new EventEmitter<ResizeMessage>()
  @Output() interaction = new EventEmitter<InteractionMessage>()
  @Output() success = new EventEmitter<SuccessMessage>()
  @Output() submit = new EventEmitter<SubmitMessage>()
  @Output() formRedirect = new EventEmitter<Message<MessageType.Redirect>>()
  @Output() verify = new EventEmitter<Message<MessageType.Verify>>()
  @Output() customStylesAppended = new EventEmitter<Message<MessageType.CustomStylesAppended>>()
  @Output() readyPaymentInstance = new EventEmitter<ClientSdkInstance>()

  private form: ClientSdkInstance | null = null
  private subscription = new Subscription()

  constructor(
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      SolidPaymentComponent
        .Sdk$
        .subscribe((sdk) => this
          .zone
          .runOutsideAngular(() => this.initForm(sdk))
        )
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()

    this.zone.runOutsideAngular(() => {
      SolidPaymentComponent.Sdk?.destroy()
    })
  }

  initForm(sdk: ClientSdk) {
    this.zone.runOutsideAngular(() => {
      this.form = sdk.init(this.initConfig)
    })

    this.readyPaymentInstance.emit(this.form as ClientSdkInstance)

    this.form?.on(MessageType.Mounted, e => this.mounted.emit(e.data))
    this.form?.on(MessageType.Error, e => this.error.emit(e.data))
    this.form?.on(MessageType.Fail, e => this.fail.emit(e.data))
    this.form?.on(MessageType.OrderStatus, e => this.orderStatus.emit(e.data))
    this.form?.on(MessageType.Resize, e => this.resize.emit(e.data))
    this.form?.on(MessageType.Interaction, e => this.interaction.emit(e.data))
    this.form?.on(MessageType.Success, e => this.success.emit(e.data))
    this.form?.on(MessageType.Submit, e => this.submit.emit(e.data))
    this.form?.on(MessageType.Redirect, e => this.formRedirect.emit(e.data))
    this.form?.on(MessageType.Verify, e => this.verify.emit(e.data))
    this.form?.on(MessageType.CustomStylesAppended, e => this.customStylesAppended.emit(e.data))
  }

  private get initConfig(): InitConfig {
    if (!this.merchantData) {
      throw new Error("Attribute 'merchantData' is required");
    }

    const config: InitConfig = {
      merchantData: this.merchantData,
      formParams: this.formParams,
    }

    this.appendIframeParams(config)
    this.appendGooglePayButtonParams(config)
    this.appendApplePayButtonParams(config)

    return config
  }


  private appendIframeParams(config: InitConfig): void {
    config.iframeParams = {
      containerId: this.id
    }

    if (this.width) {
      config.iframeParams.width = this.width
    }
  }

  private appendGooglePayButtonParams(config: InitConfig): void {
    const googlePayButtonParams = {
      ...(this.googlePayButtonParams || {})
    } as NonNullable<InitConfig['googlePayButtonParams']>

    if (googlePayButtonParams.containerId) {
      delete googlePayButtonParams.containerId
    }

    if (this.googlePayContainer) {
      if (this.googlePayContainer.id) {
        console.warn(`Id attribute "${this.googlePayContainer.id}" of GooglePay container will be overriden`)
      }

      googlePayButtonParams.containerId = `${this.id}_google_pay`
      this.googlePayContainer.id = googlePayButtonParams.containerId
    }

    if (Object.keys(googlePayButtonParams).length) {
      config.googlePayButtonParams = googlePayButtonParams
    }
  }

  private appendApplePayButtonParams(config: InitConfig): void {
    const applePayButtonParams = {
      ...(this.applePayButtonParams || {})
    } as NonNullable<InitConfig['applePayButtonParams']>

    if (applePayButtonParams.containerId) {
      delete applePayButtonParams.containerId
    }

    if (this.applePayContainer) {
      if (this.applePayContainer.id) {
        console.warn(`Id attribute "${this.applePayContainer.id}" of ApplePay container will be overriden`)
      }
      applePayButtonParams.containerId = `${this.id}_apple_pay`
      this.applePayContainer.id = applePayButtonParams.containerId
    }

    if (Object.keys(applePayButtonParams).length) {
      config.applePayButtonParams = applePayButtonParams
    }
  }
}
