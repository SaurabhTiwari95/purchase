import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntryHomeComponent } from './manual-entry-home.component';

describe('ManualEntryHomeComponent', () => {
  let component: ManualEntryHomeComponent;
  let fixture: ComponentFixture<ManualEntryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualEntryHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEntryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
