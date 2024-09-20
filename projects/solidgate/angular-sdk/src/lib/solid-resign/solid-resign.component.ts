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
  ClientSdk,
  ClientSdkInstance,
  CustomStylesAppendedMessage,
  ErrorMessage,
  FailMessage,
  ResignRequest,
  ResignFormConfig,
  InteractionMessage,
  PaymentDetailsMessage,
  MessageType,
  MountedMessage,
  OrderStatusMessage,
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
  [key in keyof Omit<SdkMessage, "card">]: EventEmitter<SdkMessage[key]>
}

interface ResignElement {
  resignRequest?: ResignRequest, // required
  container?: NonNullable<ResignFormConfig['container']>,
  appearance?: NonNullable<ResignFormConfig['appearance']>,
  styles?: NonNullable<ResignFormConfig['styles']>,
}

@Component({
  selector: 'ngx-solid-resign',
  template: `
    <div [id]="id"></div>
  `,
  styles: [`
    ngx-solid-resign iframe {
      border: none;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolidResignComponent implements DoCheck, AfterViewInit, OnDestroy, ClientSdkEventsProvider, ResignElement {
  private static Sdk$ = from(SdkLoader.load()).pipe(
    tap(sdk => SolidResignComponent.Sdk = sdk)
  )
  private static Sdk: ClientSdk | null = null

  public id = `${Math.random()}_${Date.now()}_solid_sdk`


  @Input() resignRequest: ResignElement['resignRequest']
  @Input() container: ResignElement['container']
  @Input() appearance: ResignElement['appearance']
  @Input() styles: ResignElement['styles']

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
  @Output() paymentDetails = new EventEmitter<PaymentDetailsMessage>()
  @Output() readyResignInstance = new EventEmitter<ClientSdkInstance>()
  @Output() resignInitFailed = new EventEmitter<Error>()

  private isListenersConnected = false
  private form: ClientSdkInstance | null = null
  private subscription = new Subscription()
  private previousInitKey = ""

  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
  ) {}

  ngDoCheck() {
    const { key} = this.initResignConfig()

    if (this.previousInitKey && this.previousInitKey !== key) {
      this.subscription.add(
        SolidResignComponent
          .Sdk$
          .subscribe((sdk) => this.initForm(sdk))
      )
    }
  }

  ngAfterViewInit() {
    this.subscription.add(
      SolidResignComponent
        .Sdk$
        .subscribe((sdk) => this.initForm(sdk))
    )

    this.cd.detach();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()

    this.zone.runOutsideAngular(() => {
      SolidResignComponent.Sdk?.destroy()
    })
  }

  initForm(sdk: ClientSdk | null) {
    const { config, key} = this.initResignConfig()

    if (this.previousInitKey === key || !sdk) {
      return;
    }

    this.zone.runOutsideAngular(async () => {
      try {
        this.previousInitKey = key;

        this.form = await sdk.resign(config.resignRequest, config.formConfig);

        if (!this.form) {
          return;
        }

        if (!this.isListenersConnected) {
          this.connectListeners(this.form);
        }
      } catch (error) {
        this.resignInitFailed.emit(error as Error)
      }
    })
  }

  private connectListeners(form: ClientSdkInstance): void {
    this.readyResignInstance.emit(form)

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
      form.on(MessageType.PaymentDetails, e => this.paymentDetails.emit(e.data))

      this.isListenersConnected = true
    })
  }

  private initResignConfig(): {
    config: {
      resignRequest: ResignRequest
      formConfig?: ResignFormConfig
    }
    key: string
  } {
    if (!this.resignRequest) {
      throw new Error("Attribute 'resignRequest' is required");
    }

    const formConfig: ResignFormConfig = {
      container: {
        ...this.container,
        id: this.id
      }
    }

    if (this.appearance) {
      formConfig.appearance = this.appearance
    }
    if (this.styles) {
      formConfig.styles = this.styles
    }

    const config = {
      resignRequest: this.resignRequest,
      formConfig
    }

    return {
      config,
      key: JSON.stringify(config)
    }
  }
}
