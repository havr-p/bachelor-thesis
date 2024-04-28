import { TestBed } from '@angular/core/testing';

import { RequirementsService } from './requirements.service';

describe('RequirementsService', () => {
  let service: RequirementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequirementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
