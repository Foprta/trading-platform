import { TestBed } from '@angular/core/testing';

import { TradingService } from './trading.service';

describe('TradingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TradingService = TestBed.get(TradingService);
    expect(service).toBeTruthy();
  });
});
