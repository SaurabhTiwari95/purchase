import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToVendorComponent } from './send-to-vendor.component';

describe('SendToVendorComponent', () => {
  let component: SendToVendorComponent;
  let fixture: ComponentFixture<SendToVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendToVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
