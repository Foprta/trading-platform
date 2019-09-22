import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BinanceService } from 'src/app/services/exchanges/binance/binance.service';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit {
  @Output() createTrade = new EventEmitter();

  constructor(private _binanceSevice: BinanceService) {
  }

  ngOnInit() {
    this._binanceSevice.getCandles('btcusdt', '1m').subscribe((data) => {
      console.log(data);
    })
    this.createTrade.emit('Jopa')
  }
}