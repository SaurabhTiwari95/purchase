import { TestBed } from '@angular/core/testing';

import { ServiceForVendorRfqService } from './service-for-vendor-rfq.service';

describe('ServiceForVendorRfqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceForVendorRfqService = TestBed.get(ServiceForVendorRfqService);
    expect(service).toBeTruthy();
  });
});
