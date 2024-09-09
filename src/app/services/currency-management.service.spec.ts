import { TestBed } from '@angular/core/testing';

import { CurrencyManagementService } from './currency-management.service';

describe('CurrencyManagementService', () => {
  let service: CurrencyManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
