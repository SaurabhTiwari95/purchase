import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVendorBankDetailsComponent } from './update-vendor-bank-details.component';

describe('UpdateVendorBankDetailsComponent', () => {
  let component: UpdateVendorBankDetailsComponent;
  let fixture: ComponentFixture<UpdateVendorBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateVendorBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVendorBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
