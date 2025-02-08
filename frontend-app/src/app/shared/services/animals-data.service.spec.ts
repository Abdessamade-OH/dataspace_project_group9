import { TestBed } from '@angular/core/testing';

import { AnimalsDataService } from './animals-data.service';

describe('AnimalsDataService', () => {
  let service: AnimalsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
