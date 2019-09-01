import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { WsHandlerService } from 'src/app/shared/services/ws-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TradingService implements OnInit, OnDestroy{
  state: Object;

  constructor(private ws: WebsocketService) { }

    updateState(e) {
      this.state = e;
    }

    getBalance() {
      this.ws.getBalance();
      //this.ws.sendOrder()
    }

    placeOrder() {

    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }
}
