import { Injectable, OnInit } from '@angular/core';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WsHandlerService implements OnInit {
  public dataStorage = {trades: new Subject<object>(), candlesticks: new Subject<any>(), candlestick: new Subject<object>()};


  public handleInput(data) {
    switch (data.type) {
      case "trades": {
        this.dataStorage.trades.next(data.data);
        break;
      }
      case "candlesticks": {
        this.dataStorage.candlesticks.next(data.data);
        break;
      }
      case "candlestick": {
        this.dataStorage.candlestick.next(data.data);
        break;
      }
    }
  }

  ngOnInit() {
  }

  constructor() { }
}
