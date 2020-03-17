import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqPurposeMappingComponent } from './rfq-purpose-mapping.component';

describe('RfqPurposeMappingComponent', () => {
  let component: RfqPurposeMappingComponent;
  let fixture: ComponentFixture<RfqPurposeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqPurposeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqPurposeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
