import { TestBed } from '@angular/core/testing';

import { CreditDataService } from './credit-data.service';

describe('CreditDataService', () => {
  let service: CreditDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
