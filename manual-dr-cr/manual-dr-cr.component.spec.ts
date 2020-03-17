import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDrCrComponent } from './manual-dr-cr.component';

describe('ManualDrCrComponent', () => {
  let component: ManualDrCrComponent;
  let fixture: ComponentFixture<ManualDrCrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualDrCrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualDrCrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
