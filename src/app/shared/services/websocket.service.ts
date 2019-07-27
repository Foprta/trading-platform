import {Injectable, Output} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {WsHandlerService} from './ws-handler.service';

export class Message {
  constructor(
    public type: string,
    public data: string,
    public settings?: any
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subscriptions: string[] = [];
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
    if (this.subscriptions.includes(d.data)) {return; }
    this.subscriptions.push(d.data);
    this.socket$.next(d);
  }

  // Ищет подписку в массиве
  // Если есть, то посылает отписку
  public unsubscribeData(d) {
    const index = this.subscriptions.indexOf(d.data);
    if (index > -1) {
      this.subscriptions.splice(index, 1);
      this.socket$.next(d);
    } else {
      console.error("there is no sub");
    }
  }

  // Одноразовое получение инфы
  public getData(d) {
    this.socket$.next(d);
  }
}
