import { Injectable, OnInit } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WsHandlerService implements OnInit {
  public dataStorage = {trades: {}, candlesticks: {}, kline: {}, balance: undefined};


  public handleInput(data) {
    switch (data.type) {
      case "trades": {
        this.dataStorage.trades[data.symbol+"@trades"].next(data.data);
        break;
      }
      case "candlesticks": {
        this.dataStorage.candlesticks[data.symbol+"@candlesticks_"+data.time].next(data.data);
        break;
      }
      case "kline": {
        this.dataStorage.kline[data.symbol+"@kline_"+data.time].next(data.data);
        break;
      }
      case "balance": {
        this.dataStorage.balance.next(data.data);
        break;
      }
    }
  }

  ngOnInit() {
  }

  constructor() { }
}
