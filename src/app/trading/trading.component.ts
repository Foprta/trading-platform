import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../shared/services/websocket.service';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
  constructor(private ws: WebsocketService) {
  }

  log(e) {
    console.log(e)
  }

  ngOnInit() {
    this.ws.connect();
  }
}
