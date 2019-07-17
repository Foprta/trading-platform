import { TestBed } from '@angular/core/testing';

import { WsHandlerService } from './ws-handler.service';

describe('WsHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsHandlerService = TestBed.get(WsHandlerService);
    expect(service).toBeTruthy();
  });
});
