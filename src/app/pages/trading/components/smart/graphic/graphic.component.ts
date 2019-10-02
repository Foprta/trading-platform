import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit
} from "@angular/core";
import { BinanceService } from "src/app/services/exchanges/binance/binance.service";
import { ICandle } from "./interfaces/candle.interface";
import { PriceCanvas } from "./classes/price-canvas.class";
import { TimeCanvas } from "./classes/time-canvas.class";
import { GraphicCanvas } from "./classes/graphic-canvas.class";

@Component({
  selector: "app-graphic",
  templateUrl: "./graphic.component.html",
  styleUrls: ["./graphic.component.scss"]
})
export class GraphicComponent implements OnInit, AfterViewInit {
  @Output("createTrade") createTrade = new EventEmitter();

  @ViewChild("graphic") graphicERef: ElementRef;
  @ViewChild("price") priceERef: ElementRef;
  @ViewChild("time") timeERef: ElementRef;

  symbol: string = "btcusdt";
  time: string = "1m";

  graphicCanvas: GraphicCanvas;
  priceCanvas: PriceCanvas;
  timeCanvas: TimeCanvas;

  loading: boolean = true;
  candles: Record<string, ICandle> = {};

  constructor(private _binanceSevice: BinanceService) {}

  redraw() {
    Object.keys(this.candles).forEach(element => {
      this.graphicCanvas.drawCandleBody(this.candles[element]);
    });
  }

  /**
   * Add new candles to candles-array
   *
   * @param {any} candles - {t, o, h, l, c, v}
   * @memberof GraphicComponent
   */
  addLoadedCandles(candles: any) {
    candles.forEach(e => {
      this.candles[e[0]] = {
        time: e[0],
        open: e[1],
        high: e[2],
        low: e[3],
        close: e[4],
        volume: e[5]
      };
    });
  }

  resizeEvent(event) {
    this.graphicERef.nativeElement.width = event.newWidth;
    this.graphicERef.nativeElement.height = event.newHeight;
    this.timeERef.nativeElement.width = event.newWidth;
    this.priceERef.nativeElement.height = event.newHeight;
    this.graphicCanvas.rescaleX(0, 300);
  }

  loadCandles(limit?: string, endTime?: string, startTime?: string) {
    this._binanceSevice
      .getCandles(this.symbol, this.time, limit, endTime, startTime)
      .subscribe(data => {
        this.addLoadedCandles(data["ticks"]);
        this.redraw();
        this.loading = false;
      });
  }

  ngOnInit() {
    this.priceCanvas = new PriceCanvas(this.priceERef);
    this.timeCanvas = new TimeCanvas(this.timeERef);
    this.graphicCanvas = new GraphicCanvas(this.graphicERef);
    this.loadCandles();
  }

  ngAfterViewInit() {}
}
