import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterImportComponent } from './product-master-import.component';

describe('ProductMasterImportComponent', () => {
  let component: ProductMasterImportComponent;
  let fixture: ComponentFixture<ProductMasterImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMasterImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMasterImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
