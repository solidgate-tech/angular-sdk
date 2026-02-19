import {from, Subscription, tap} from "rxjs";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  CardMessage,
  ClientSdk,
  ClientSdkInstance,
  CustomStylesAppendedMessage,
  ErrorMessage,
  FailMessage,
  InitConfig,
  InteractionMessage,
  MessageType,
  MountedMessage,
  OrderStatusMessage,
  PaymentDetailsMessage,
  RedirectMessage,
  ResizeMessage,
  SdkLoader,
  SdkMessage,
  SubmitMessage,
  SuccessMessage,
  VerifyMessage,
} from "@solidgate/client-sdk-loader"

import '../../boot'

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
  paypalButtonParams?: Omit<InitConfig['paypalButtonParams'], 'containerId'>
  pixButtonParams?: Omit<InitConfig['pixButtonParams'], 'containerId'>
  bizumButtonParams?: Omit<InitConfig['bizumButtonParams'], 'containerId'>
  blikButtonParams?: Omit<InitConfig['blikButtonParams'], 'containerId'>
  mbwayButtonParams?: Omit<InitConfig['mbwayButtonParams'], 'containerId'>
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
export class SolidPaymentComponent implements DoCheck, AfterViewInit, OnDestroy, ClientSdkEventsProvider, PaymentElement {
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
  @Input() paypalButtonParams: PaymentElement['paypalButtonParams']
  @Input() pixButtonParams: PaymentElement['pixButtonParams']
  @Input() bizumButtonParams: PaymentElement['bizumButtonParams']
  @Input() blikButtonParams: PaymentElement['blikButtonParams']
  @Input() mbwayButtonParams: PaymentElement['mbwayButtonParams']
  @Input() applePayContainer: HTMLElement | undefined
  @Input() googlePayContainer: HTMLElement | undefined
  @Input() paypalContainer: HTMLElement | undefined
  @Input() pixContainer: HTMLElement | undefined
  @Input() bizumContainer: HTMLElement | undefined
  @Input() blikContainer: HTMLElement | undefined
  @Input() mbwayContainer: HTMLElement | undefined

  @Output() mounted = new EventEmitter<MountedMessage>()
  @Output() error = new EventEmitter<ErrorMessage>()
  @Output() fail = new EventEmitter<FailMessage>()
  @Output() orderStatus = new EventEmitter<OrderStatusMessage>()
  @Output() resize = new EventEmitter<ResizeMessage>()
  @Output() interaction = new EventEmitter<InteractionMessage>()
  @Output() success = new EventEmitter<SuccessMessage>()
  @Output() submit = new EventEmitter<SubmitMessage>()
  @Output() formRedirect = new EventEmitter<RedirectMessage>()
  @Output() verify = new EventEmitter<VerifyMessage>()
  @Output() customStylesAppended = new EventEmitter<CustomStylesAppendedMessage>()
  @Output() readyPaymentInstance = new EventEmitter<ClientSdkInstance>()
  @Output() card = new EventEmitter<CardMessage>()
  @Output() paymentDetails = new EventEmitter<PaymentDetailsMessage>()

  private isListenersConnected = false
  private form: ClientSdkInstance | null = null
  private subscription = new Subscription()
  private previousInitKey = ""

  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
  ) {}

  ngDoCheck() {
    const { key} = this.initConfig()

    if (this.previousInitKey && this.previousInitKey !== key) {
      this.subscription.add(
        SolidPaymentComponent
          .Sdk$
          .subscribe((sdk) => this.initForm(sdk))
      )
    }
  }

  ngAfterViewInit() {
    this.subscription.add(
      SolidPaymentComponent
        .Sdk$
        .subscribe((sdk) => this.initForm(sdk))
    )

    this.cd.detach();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()

    this.zone.runOutsideAngular(() => {
      SolidPaymentComponent.Sdk?.destroy()
    })
  }

  initForm(sdk: ClientSdk | null) {
    const {config, key} = this.initConfig()

    if (this.previousInitKey === key || !sdk) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.previousInitKey = key
      this.form = sdk.init(config)
    })

    if (!this.form) {
      return
    }

    if (!this.isListenersConnected) {
      this.connectListeners(this.form);
    }
  }

  private connectListeners(form: ClientSdkInstance): void {
    this.readyPaymentInstance.emit(form)

    this.zone.runOutsideAngular(() => {
      form.on(MessageType.Mounted, e => this.mounted.emit(e.data))
      form.on(MessageType.Error, e => this.error.emit(e.data))
      form.on(MessageType.Fail, e => this.fail.emit(e.data))
      form.on(MessageType.OrderStatus, e => this.orderStatus.emit(e.data))
      form.on(MessageType.Resize, e => this.resize.emit(e.data))
      form.on(MessageType.Interaction, e => this.interaction.emit(e.data))
      form.on(MessageType.Success, e => this.success.emit(e.data))
      form.on(MessageType.Submit, e => this.submit.emit(e.data))
      form.on(MessageType.Redirect, e => this.formRedirect.emit(e.data))
      form.on(MessageType.Verify, e => this.verify.emit(e.data))
      form.on(MessageType.CustomStylesAppended, e => this.customStylesAppended.emit(e.data))
      form.on(MessageType.Card, (e) => this.card.emit(e.data))
      form.on(MessageType.PaymentDetails, (e) => this.paymentDetails.emit(e.data))

      this.isListenersConnected = true
    })
  }

  private initConfig(): {
    config: InitConfig
    key: string
  } {
    if (!this.merchantData) {
      throw new Error("Attribute 'merchantData' is required");
    }

    const config: InitConfig = {
      merchantData: this.merchantData,
      formParams: this.formParams,
      styles: this.styles,
      applePayButtonParams: this.applePayButtonParams,
      googlePayButtonParams: this.googlePayButtonParams,
      paypalButtonParams: this.paypalButtonParams,
      pixButtonParams: this.pixButtonParams,
      bizumButtonParams: this.bizumButtonParams,
      blikButtonParams: this.blikButtonParams,
      mbwayButtonParams: this.mbwayButtonParams
    }

    this.appendIframeParams(config)
    this.appendPayButtonParams(config, 'googlePayButtonParams', this.googlePayContainer)
    this.appendPayButtonParams(config, 'applePayButtonParams', this.applePayContainer)
    this.appendPayButtonParams(config, 'paypalButtonParams', this.paypalContainer)
    this.appendPayButtonParams(config, 'pixButtonParams', this.pixContainer)
    this.appendPayButtonParams(config, 'bizumButtonParams', this.bizumContainer)
    this.appendPayButtonParams(config, 'blikButtonParams', this.blikContainer)
    this.appendPayButtonParams(config, 'mbwayButtonParams', this.mbwayContainer)

    return {
      config,
      key: JSON.stringify(config)
    }
  }

  private appendIframeParams(config: InitConfig): void {
    config.iframeParams = {
      containerId: this.id
    }

    if (this.width) {
      config.iframeParams.width = this.width
    }
  }

  private appendPayButtonParams<T extends 'googlePayButtonParams' | 'applePayButtonParams' | 'paypalButtonParams' | 'pixButtonParams' | 'bizumButtonParams' | 'blikButtonParams' | 'mbwayButtonParams'>(
    config: InitConfig,
    key: T,
    container: HTMLElement | undefined
  ) {
    const syntheticContainerId = `${this.id}_${key}`;
    const payButtonParams = {
      ...(config[key] || {})
    } as NonNullable<InitConfig[T]>

    if (payButtonParams.containerId) {
      delete payButtonParams.containerId
    }

    if (container) {
      if (container.id && container.id !== syntheticContainerId) {
        console.warn(`Id attribute "${container.id}" of container for ${key} will be overriden`)
      }

      payButtonParams.containerId = syntheticContainerId
      container.id = payButtonParams.containerId
    }

    if (Object.keys(payButtonParams).length) {
      config[key] = payButtonParams
    }
  }
}
