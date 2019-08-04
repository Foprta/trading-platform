import { TestBed } from '@angular/core/testing';

import { TradingFunctionsService } from './trading-functions.service';

describe('TradingFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TradingFunctionsService = TestBed.get(TradingFunctionsService);
    expect(service).toBeTruthy();
  });
});
