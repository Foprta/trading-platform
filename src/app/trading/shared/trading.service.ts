import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { WsHandlerService } from 'src/app/shared/services/ws-handler.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradingService implements OnInit, OnDestroy {
  state = { symbol: undefined, base: undefined, price: undefined};
  symbol$ = new Subject<string>();
  balances: any;

  constructor(private ws: WebsocketService,
    private wsh: WsHandlerService) { }

  updateState(e) {
    if (this.state['symbol'] != e.symbol || this.state.base != e.base) {
      this.symbol$.next(e.symbol + e.base);
    }
    this.state = e;
  }

  getBalance() {
    this.wsh.dataStorage.balances$.subscribe(data => {
      this.balances = data;
    })
  }

  placeOrder(price) {
    if (!this.balances) return;
    this.state.price = price;
    let order = {
      type: "order",
      data: this.state
    }
    this.ws.sendOrder(order);
  }

  ngOnInit() {
    console.log("getOrders");
  }

  ngOnDestroy() {

  }
}
