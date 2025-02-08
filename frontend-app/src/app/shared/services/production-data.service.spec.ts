import { TestBed } from '@angular/core/testing';

import { ProductionDataService } from './production-data.service';

describe('ProductionDataService', () => {
  let service: ProductionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
