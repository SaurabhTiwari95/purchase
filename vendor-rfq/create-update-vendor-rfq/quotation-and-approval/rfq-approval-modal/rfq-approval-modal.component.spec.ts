import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqApprovalModalComponent } from './rfq-approval-modal.component';

describe('RfqApprovalModalComponent', () => {
  let component: RfqApprovalModalComponent;
  let fixture: ComponentFixture<RfqApprovalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqApprovalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
