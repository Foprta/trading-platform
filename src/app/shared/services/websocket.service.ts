import {Injectable, Output} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {WsHandlerService} from './ws-handler.service';

export class Message {
  constructor(
    public type: string,
    public data: string
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subscriptions: string[] = [];
  private socket$: any;
  private pingTimeout;

  // noinspection JSAnnotator


  constructor(private wsHandler: WsHandlerService) {
  }

  public connect() {
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

  public disconnect() {
    this.socket$.complete();
  }

  private heartbeat() {
    this.socket$.next('pong');
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.socket$.complete();
    }, 5000 + 1000);
  }

  public subscribe(d) {
    if (this.subscriptions.includes(d.data)) {return; }
    this.subscriptions.push(d.data);
    this.socket$.next(d);
  }

  public unsubscribe(d) {
    const index = this.subscriptions.indexOf(d.data);
    if (index > -1) {
      this.subscriptions.splice(index, 1);
    }

    this.socket$.next(d);
  }
}
