import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetVendorListComponent } from './get-vendor-list.component';

describe('GetVendorListComponent', () => {
  let component: GetVendorListComponent;
  let fixture: ComponentFixture<GetVendorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetVendorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
