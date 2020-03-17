import { TestBed } from '@angular/core/testing';

import { LocalVendorProductMasterService } from './local-vendor-product-master.service';

describe('LocalVendorProductMasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalVendorProductMasterService = TestBed.get(LocalVendorProductMasterService);
    expect(service).toBeTruthy();
  });
});
