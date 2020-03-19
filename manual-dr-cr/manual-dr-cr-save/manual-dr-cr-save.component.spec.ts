import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDrCrSaveComponent } from './manual-dr-cr-save.component';

describe('ManualDrCrSaveComponent', () => {
  let component: ManualDrCrSaveComponent;
  let fixture: ComponentFixture<ManualDrCrSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualDrCrSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualDrCrSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
