import { TestBed } from '@angular/core/testing';

import { EmploymentDataService } from './employment-data.service';

describe('EmploymentDataService', () => {
  let service: EmploymentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
