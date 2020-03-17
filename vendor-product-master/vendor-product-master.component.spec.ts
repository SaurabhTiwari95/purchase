import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProductMasterComponent } from './vendor-product-master.component';

describe('VendorProductMasterComponent', () => {
  let component: VendorProductMasterComponent;
  let fixture: ComponentFixture<VendorProductMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProductMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
