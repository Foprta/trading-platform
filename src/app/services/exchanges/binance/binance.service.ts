import { Injectable } from '@angular/core';
import { SocketService } from '../../socket/socket.service';
import { Subject } from 'rxjs';
import { ISubscription } from './interfaces/subscription.interface';
import { BinanceOptionsToSubscribtionName } from 'src/app/helpers/binance/subscription-name.helper';
import { BackendService } from '../../backend/backend.service';
import { URLS_CONFIG } from 'src/app/configs/urls.config';


@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  subscriptions: ISubscription[] = [];

  constructor(
    private _socketService: SocketService,
    private _backendService: BackendService) {
   }

  private _findSubscription(type, symbol, time?): Subject<any> {
    const subscription = BinanceOptionsToSubscribtionName(type, symbol, time);
    const index = this.subscriptions.findIndex(e => e.name === subscription)
    if (index > 0) {
      this.subscriptions[index].subscribers++;
      return this.subscriptions[index].subject$;
    }
    return;
  }

  private _createSubscription(type, symbol, time?): Subject<any> {
    const subscriptionName = BinanceOptionsToSubscribtionName(type, symbol, time);
    const subject$: Subject<any> = this._socketService.addSubscription(type, symbol, time);
    const subscription: ISubscription = {
      subject$: subject$,
      name: subscriptionName,
      subscribers: 1
    }
    this.subscriptions.push(subscription);
    subject$.subscribe(null, null, () => {      
      const index = this.subscriptions.indexOf(subscription);
      this.subscriptions[index].subscribers--;
      if (this.subscriptions[index].subscribers <= 0) {
        this._socketService.removeSubscription(subscriptionName);
      }
      this.subscriptions.splice(index, 1);
    })
    return subject$;
  }

  getKline(symbol, time): Subject<any> {
    return this._findSubscription('kline', symbol, time) || this._createSubscription('kline', symbol, time);
  }

  getTrades(symbol): Subject<any> {
    return this._findSubscription('trade', symbol) || this._createSubscription('trade', symbol);
  }

  getCandles(symbol: string, time: string, limit?: number, endTime?: number, startTime?: number) {
    const options = {
      symbol: symbol,
      time: time,
      limit: limit || undefined,
      endTime: endTime || undefined,
      startTime: startTime || undefined,
    }
    return this._backendService.post(URLS_CONFIG.BINANCE_URL.CANDLES, options)
  }
}
