import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WsHandlerService } from './ws-handler.service';
import { Subject } from 'rxjs';

export class Message {
  constructor(
    public type: string,
    public data: object
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subscriptions: object = {};
  private socket$: any = undefined;
  private pingTimeout;

  constructor(private wsHandler: WsHandlerService) {
  }

  // Создает соединение настраивая пинг-понг
  public connect() {
    if (this.socket$ != undefined) return;
    this.socket$ = webSocket('ws://localhost:8080');
    this.socket$.next('pong');

    this.socket$
      .subscribe(
        (message) => message === 'ping' ? this.heartbeat() : this.wsHandler.handleInput(message),
        (err) => {
          console.error(err);
          this.disconnect();
        },
        () => console.warn('Completed!')
      );
  }

  // Закрывает соединение
  public disconnect() {
    this.socket$.complete();
  }

  // Логика пинг-понга
  private heartbeat() {
    this.socket$.next('pong');
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.socket$.complete();
    }, 5000 + 1000);
  }

  // Подписка на инфу
  // Если уже подписан, то ретурн
  // В массив подписок добавляется "BTCUSDT@candles"
  public subscribeData(d) {
    const subscribtion = d.data.symbol + "@" + d.data.type + "_" + d.data.candlesTime;
    if (this.subscriptions[subscribtion]) {
      this.subscriptions[subscribtion]++;
    } else {
      this.wsHandler.dataStorage.kline[subscribtion] = new Subject<object>();
      this.subscriptions[subscribtion] = 1;
      this.socket$.next(d);
    }
  }

  // Ищет подписку в массиве
  // Если есть, то посылает отписку
  public unsubscribeData(d) {
    const subscribtion = d.data.symbol + "@" + d.data.type + "_" + d.data.candlesTime;
    if (this.subscriptions[subscribtion] > 1) {
      this.subscriptions[subscribtion]--;
    } else if (this.subscriptions[subscribtion] == 1) {
      this.subscriptions[subscribtion]--;
      this.socket$.next(d);
    } else {
      console.error("there is no sub");
    }
  }

  // Одноразовое получение свечей
  public getData(d) {
    const subscribtion = d.data.symbol + "@" + d.data.type + "_" + d.data.candlesTime;
    if (!this.wsHandler.dataStorage.candlesticks[subscribtion]) {
      this.wsHandler.dataStorage.candlesticks[subscribtion] = new Subject<object>();
    }
    this.socket$.next(d);
  }

  // Послать заявку на позицию
  public sendOrder(d) {
    const subscribtion = d.data.symbol + "@orders";
    if (!this.wsHandler.dataStorage.candlesticks[subscribtion]) {
      this.wsHandler.dataStorage.candlesticks[subscribtion] = new Subject<object>();
    }
    this.socket$.next(d);
  }

  // Подписка на баланс
  public getBalance() {
    const data = {
      type: "balance",
      data: {
        type: "balance"
      }
    }
    if (!this.wsHandler.dataStorage.balance) {
      this.wsHandler.dataStorage.balance = new Subject<object>();
    }
    this.socket$.next(data)
  }
}
