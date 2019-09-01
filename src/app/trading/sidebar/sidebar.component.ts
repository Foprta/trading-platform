import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TradingService } from '../shared/trading.service';
import { WsHandlerService } from 'src/app/shared/services/ws-handler.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  orderForm: FormGroup;
  money: any = "Loading...";
  symbol: any = "Loading...";
  orderAmount: any = 0.0000;

  constructor(private fb: FormBuilder,
    private ts: TradingService,
    private wsh: WsHandlerService) { }

  log(e) {
    console.log(e)
  }

  changeSlider(e) {
    let side = this.orderForm.value.orderSide;
    if (side == "buy") {
      this.orderAmount = (this.money*(e.value/100)).toFixed(4);
    } else {
      this.orderAmount = (this.symbol*(e.value/100)).toFixed(4);
    }
  }

  onChange(e) {
    this.ts.updateState(e);
    this.changeSlider({value: this.orderForm.value.orderValue});
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderSide: ['buy'],
      orderType: ['market'],
      orderValue: [10]
    });

    this.orderForm.valueChanges.subscribe((e) => this.onChange(e))

    this.ts.getBalance();

    this.wsh.dataStorage.balance.subscribe((d) => {
      this.symbol = d.ETH.available;
      this.money = d.USDT.available;
      this.changeSlider({value: this.orderForm.value.orderValue});
    })
  }
}