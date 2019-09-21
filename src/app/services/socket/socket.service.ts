import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { IRequest } from './inrefaces/request.interface';
import { Subject } from 'rxjs';
import { BinanceOptionsToSubscribtionName } from 'src/app/helpers/binance/subscription-name.helper';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = this._backend.getSocket();

  constructor(private _backend: BackendService) { }

  public addSubscription(type: string, symbol: string, time?: string): Subject<any> {
    const subscription = BinanceOptionsToSubscribtionName(type, symbol, time);
    let subject$ = new Subject<any>();
    this.socket.emit('sub', {
      type: type,
      options: {
        symbol: symbol,
        time: time || undefined,
      }
    });
    this.socket.on(subscription, (data) => {
      subject$.next(data);
    })
    return subject$;
  }

  public removeSubscription(subscription: string): void {
    console.log('removing')
    this.socket.emit('unsub', subscription);
  }
}
