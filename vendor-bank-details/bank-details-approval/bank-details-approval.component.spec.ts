import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsApprovalComponent } from './bank-details-approval.component';

describe('BankDetailsApprovalComponent', () => {
  let component: BankDetailsApprovalComponent;
  let fixture: ComponentFixture<BankDetailsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
