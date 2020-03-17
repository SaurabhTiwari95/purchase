import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementModalComponent } from './unit-of-measurement-modal.component';

describe('UnitOfMeasurementModalComponent', () => {
  let component: UnitOfMeasurementModalComponent;
  let fixture: ComponentFixture<UnitOfMeasurementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitOfMeasurementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
