import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleVendorMappingComponent } from './principle-vendor-mapping.component';

describe('PrincipleVendorMappingComponent', () => {
  let component: PrincipleVendorMappingComponent;
  let fixture: ComponentFixture<PrincipleVendorMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipleVendorMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipleVendorMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
