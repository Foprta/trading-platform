import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingRoutingModule } from './trading-routing.module';
import { TradingComponent } from './trading.component';
import { GraphicComponent } from './components/smart/graphic/graphic.component';

@NgModule({
  declarations: [TradingComponent, GraphicComponent],
  imports: [
    CommonModule,
    TradingRoutingModule
  ]
})
export class TradingModule { }
