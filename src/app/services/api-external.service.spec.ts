import { TestBed } from '@angular/core/testing';

import { ExternalApiServiceService } from './api-external.service';

describe('ExternalApiServiceService', () => {
  let service: ExternalApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});