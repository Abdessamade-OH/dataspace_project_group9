import { TestBed } from '@angular/core/testing';

import { WaterDataService } from './water-data.service';

describe('WaterDataService', () => {
  let service: WaterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
