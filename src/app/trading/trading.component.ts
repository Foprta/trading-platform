import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  log(e) {
    console.log(e)
  }

  

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderSide: ['buy'],
      orderType: ['market'],
      orderValue: [10]
    });
  }
}
