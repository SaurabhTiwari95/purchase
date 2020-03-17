import { TestBed } from '@angular/core/testing';

import { ManualDrCrServiceService } from './manual-dr-cr-service.service';

describe('ManualDrCrServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualDrCrServiceService = TestBed.get(ManualDrCrServiceService);
    expect(service).toBeTruthy();
  });
});
