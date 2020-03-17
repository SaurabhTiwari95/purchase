import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationDetailsModalComponent } from './quotation-details-modal.component';

describe('QuotationDetailsModalComponent', () => {
  let component: QuotationDetailsModalComponent;
  let fixture: ComponentFixture<QuotationDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
