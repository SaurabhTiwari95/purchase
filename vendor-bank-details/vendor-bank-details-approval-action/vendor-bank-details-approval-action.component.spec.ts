import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBankDetailsApprovalActionComponent } from './vendor-bank-details-approval-action.component';

describe('VendorBankDetailsApprovalActionComponent', () => {
  let component: VendorBankDetailsApprovalActionComponent;
  let fixture: ComponentFixture<VendorBankDetailsApprovalActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorBankDetailsApprovalActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBankDetailsApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
