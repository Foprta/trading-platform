import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { BinanceService } from "src/app/services/exchanges/binance/binance.service";
import { ICandle } from "./interfaces/candle.interface";
import { PriceCanvas } from "./classes/price-canvas.class";
import { TimeCanvas } from "./classes/time-canvas.class";
import { GraphicCanvas } from "./classes/graphic-canvas.class";
import { fromEvent } from "rxjs";
import {
  skipUntil,
  takeUntil,
  repeat,
} from "rxjs/operators";
import {TIMES} from "./enums/times.enum"

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
  minTime = Date.now().valueOf();   // TODO: Сделать нормальные окна
  maxTime = 0;
  minPrice = 10000000;
  maxPrice = 0;

  autoscale: boolean = false;

  prevOffsetX: number = 0;
  prevOffsetY: number = 0;

  constructor(private _binanceSevice: BinanceService) {}

  rescale() {
    this.graphicCanvas.setXScale(this.minTime, this.maxTime);
    this.graphicCanvas.setYScale(this.minPrice, this.maxPrice);
  }

  redraw() {
    this.graphicCanvas.drawBackground();
    this.rescale();
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
        open: parseFloat(e[1]),
        high: parseFloat(e[2]),
        low: parseFloat(e[3]),
        close: parseFloat(e[4]),
        volume: parseFloat(e[5])
      };

      this.updatePriceWindow(this.candles[e[0]]);
      this.updateTimeWindow(this.candles[e[0]]);
    });
  }

  updateTimeWindow(candle: ICandle) {
    this.minTime = Math.min(this.minTime, candle.time);
    this.maxTime = Math.max(this.maxTime, candle.time);
  }

  updatePriceWindow(candle: ICandle) {
    this.minPrice = Math.min(this.minPrice, candle.low);
    this.maxPrice = Math.max(this.maxPrice, candle.high);
  }

  resizeEvent(event) {
    this.graphicERef.nativeElement.width = event.newWidth;
    this.graphicERef.nativeElement.height = event.newHeight;
    this.timeERef.nativeElement.width = event.newWidth;
    this.priceERef.nativeElement.height = event.newHeight;
    this.redraw();
  }

  loadCandles(limit?: number, endTime?: number, startTime?: number) {
    this.loading = true;
    this._binanceSevice
      .getCandles(this.symbol, this.time, limit, endTime, startTime)
      .subscribe(data => {
        this.addLoadedCandles(data["ticks"]);
        this.redraw();
        this.loading = false;
      });
  }

  initLastCandleStream() {
    this._binanceSevice.getKline("btcusdt", "1m").subscribe(({ k }) => {
      this.candles[k.t] = {
        time: k.t,
        open: parseFloat(k.o),
        close: parseFloat(k.c),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        volume: parseFloat(k.v)
      };
      this.redraw();
    });
  }

  drawCursor({ offsetX, offsetY }: any) {
    this.graphicCanvas.drawCursor(offsetX, offsetY);
  }

  setGraphicOffsets(x, y) {
    const [invertedX, invertedY] = this.getInvertedOffsets(x, y);
    let draggedOffsetY =
      invertedY - this.graphicCanvas.getInvertedY(this.prevOffsetY);
    let draggedOffsetX =
      invertedX - this.graphicCanvas.getInvertedX(this.prevOffsetX);
    this.graphicCanvas.setDraggedOffsets(draggedOffsetX, draggedOffsetY);
    this.setPrevOffsets(x, y);
  }

  getInvertedOffsets(x, y) {
    return [
      this.graphicCanvas.getInvertedX(x),
      this.graphicCanvas.getInvertedY(y)
    ];
  }

  setPrevOffsets(x, y) {
    this.prevOffsetX = x;
    this.prevOffsetY = y;
  }

  checkForCandlesLoading() {
    if (this.minTime > this.graphicCanvas.getInvertedX(0)) {
      this.loadCandles(null, this.minTime, null);
    }
  }

  initMouseEvents() {
    const graphicMove$ = fromEvent(this.graphicERef.nativeElement, "mousemove");
    const graphicDown$ = fromEvent(this.graphicERef.nativeElement, "mousedown");
    const graphicUp$ = fromEvent(this.graphicERef.nativeElement, "mouseup");
    const graphicLeave$ = fromEvent(
      this.graphicERef.nativeElement,
      "mouseleave"
    );
    const documentMove$ = fromEvent(document, "mousemove");
    const documentUp$ = fromEvent(document, "mouseup");

    graphicDown$.subscribe(({ screenX, screenY }) => {
      this.setPrevOffsets(screenX, screenY);
    });

    graphicMove$
      .pipe(
        takeUntil(graphicDown$),
        repeat()
      )
      .subscribe(e => {
        this.redraw();
        this.drawCursor(e);
      });

    graphicLeave$
      .pipe(
        skipUntil(graphicMove$),
        repeat()
      )
      .subscribe(e => {
        this.redraw();
      });

    documentMove$
      .pipe(
        skipUntil(graphicDown$),
        takeUntil(documentUp$),
        repeat()
      )
      .subscribe(({ screenX, screenY }: any) => {
        this.setGraphicOffsets(screenX, screenY);
        this.redraw();
      });

    // TODO: Сделать как-то привязанным к драггингу
    documentUp$.subscribe(() => {
      this.checkForCandlesLoading();
    });
  }

  ngOnInit() {
    this.priceCanvas = new PriceCanvas(this.priceERef);
    this.timeCanvas = new TimeCanvas(this.timeERef);
    this.graphicCanvas = new GraphicCanvas(this.graphicERef);
    this.loadCandles();
    this.initLastCandleStream();
    this.initMouseEvents();
  }

  ngAfterViewInit() {}
}
