import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidResignComponent } from './solid-resign.component';

describe('SolidResignComponent', () => {
  let component: SolidResignComponent;
  let fixture: ComponentFixture<SolidResignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolidResignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolidResignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
