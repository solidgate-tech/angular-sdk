**1.2.0**

Added **formParams.autoFocus** config param

**1.1.2**

Added license

**1.1.0**

***

- Added **AdditionalFields** enum
- Fixed types which controlling labels visibility (like **initConfig.formParams.cardNumberLabel**)
- Deprecated **initConfig.allowedAdditionalFields** usage
- Added **CardMessage** event

```angular2html
<ngx-solid-payment
    [merchantData]="merchantData"
    (card)="doSomethingWithCardInfo($event)"
    width="100%"
></ngx-solid-payment>
```
