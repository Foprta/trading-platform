import { Component, OnInit } from '@angular/core';
import { BinanceService } from 'src/app/services/exchanges/binance/binance.service';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
  constructor(private _binanceService: BinanceService) { }

  ngOnInit() {
    // const trades = this._binanceService.getTrades('btcusdt');
    // trades.subscribe((data) => {
    //   console.log(data)
    // },
    // (error) => {
    //   console.log(error)
    // },
    // () => {
    //   console.log('trades completed')
    // });

    // setTimeout(() => trades.complete(), 5000)

    // this._binanceService.getKline('btcusdt', '1m').subscribe((data) => {
    //   console.log(data)
    // });

    this._binanceService.getCandles('btcusdt', '1m').subscribe((data) => console.log(data))

  }

}
