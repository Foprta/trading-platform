import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularResizedEventModule } from 'angular-resize-event';

import { TradingRoutingModule } from "./trading-routing.module";
import { TradingComponent } from "./trading.component";
import { GraphicComponent } from "./components/smart/graphic/graphic.component";
import { SocketService } from "src/app/services/socket/socket.service";
import { ComponentsModule } from "src/app/components/components.module";
import { BinanceService } from "src/app/services/exchanges/binance/binance.service";

@NgModule({
  declarations: [TradingComponent, GraphicComponent],
  imports: [CommonModule, TradingRoutingModule, ComponentsModule, AngularResizedEventModule],
  providers: [SocketService, BinanceService]
})
export class TradingModule {}
