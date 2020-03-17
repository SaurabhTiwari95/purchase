import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdVendorDetailsComponent } from './prod-vendor-details.component';

describe('ProdVendorDetailsComponent', () => {
  let component: ProdVendorDetailsComponent;
  let fixture: ComponentFixture<ProdVendorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdVendorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
