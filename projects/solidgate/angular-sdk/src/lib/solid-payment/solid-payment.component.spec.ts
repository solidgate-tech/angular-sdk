import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidPaymentComponent } from './solid-payment.component';

describe('AngularSdkComponent', () => {
  let component: SolidPaymentComponent;
  let fixture: ComponentFixture<SolidPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolidPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolidPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
