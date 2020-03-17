import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationAndApprovalComponent } from './quotation-and-approval.component';

describe('QuotationAndApprovalComponent', () => {
  let component: QuotationAndApprovalComponent;
  let fixture: ComponentFixture<QuotationAndApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationAndApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationAndApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
