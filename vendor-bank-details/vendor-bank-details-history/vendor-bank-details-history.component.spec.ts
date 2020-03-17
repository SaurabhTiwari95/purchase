import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBankDetailsHistoryComponent } from './vendor-bank-details-history.component';

describe('VendorBankDetailsHistoryComponent', () => {
  let component: VendorBankDetailsHistoryComponent;
  let fixture: ComponentFixture<VendorBankDetailsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorBankDetailsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBankDetailsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
