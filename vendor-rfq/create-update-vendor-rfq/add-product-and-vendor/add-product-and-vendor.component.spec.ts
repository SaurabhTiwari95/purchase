import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductAndVendorComponent } from './add-product-and-vendor.component';

describe('AddProductAndVendorComponent', () => {
  let component: AddProductAndVendorComponent;
  let fixture: ComponentFixture<AddProductAndVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductAndVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductAndVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
