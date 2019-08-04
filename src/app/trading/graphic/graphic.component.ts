import { AfterContentInit, Component, OnDestroy, OnInit, Input, AfterViewInit } from '@angular/core';
import { Message, WebsocketService } from '../../shared/services/websocket.service';
import * as d3 from 'd3';
import { WsHandlerService } from '../../shared/services/ws-handler.service';
import { TradingFunctionsService } from './components/trading-functions/trading-functions.service'

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  @Input("number") number: number;
  subbed: boolean = false;
  viewLoaded: boolean = false;
  graphCanvas: any;
  candles: any;
  kline: any;
  graphContext: any;
  timeCanvas: any;
  timeContext: any;
  priceCanvas: any;
  priceContext: any;
  customBase = document.createElement('custom');
  custom = d3.select(this.customBase);
  times = {
    "1m": 60000,
    "3m": 180000,
    "5m": 300000,
    "15m": 900000,
    "30m": 1800000,
    "1h": 3600000,
    "2h": 7200000,
    "4h": 14400000,
    "6h": 21600000,
    "8h": 28800000,
    "12h": 43200000,
    "1d": 86400000,
    "3d": 259200000,
    "1w": 604800000
  };
  graphicProperties = {
    subscription: "",
    width: 0,
    height: 0,
    verticalScaleWidth: 80,
    horizontalScaleHeight: 20,
    backgroundColor: "white",
    loadingCandles: false,
    minLoadedTime: 0,
    candlesTime: "1m",
    symbol: "BTCUSDT",
    maxPrice: 0,
    minPrice: 0,
    maxVolume: 0,
    maxTime: Date.now().valueOf() + 60 * 1000 * 10,
    minTime: Date.now().valueOf() - 1000 * 60 * 100,
    realCandleWide: 0,
    candleWide: 0,
    candles: [],
    mouseCoords: { x: -1, y: -1 },
    autoscale: true,
    mouseOver: false
  }

  constructor(private ws: WebsocketService,
    private wsh: WsHandlerService,
    private tfs: TradingFunctionsService) {
  }

  //#region WS_EVENTS

  // Подключение к ВебСокету
  connect() {
    this.ws.connect();
  }

  // Отключение от ВебСокета
  disconnect() {
    this.ws.disconnect();
  }

  // Создание подписки
  subscribeData(settings) {
    const msg = new Message('sub', settings);
    this.ws.subscribeData(msg);
  }

  // Отписка
  unsubscribeData(settings) {
    const msg = new Message('unsub', settings);
    this.ws.unsubscribeData(msg);
  }

  getData(settings) {
    const msg = new Message('get', settings);
    this.graphicProperties.loadingCandles = true;
    this.ws.getData(msg);
  }

  //#endregion WS_EVENTS

  log(e) {
    console.log(e)
  }

  redraw() {
    //#region Инициалиация рисования

    // Для нормальной работы скопов
    let gP = this.graphicProperties;
    let graphContext = this.graphContext;
    let priceContext = this.priceContext;
    let timeContext = this.timeContext;

    // Могут не прогрузиться свечки
    if (gP.candles.length == 0) {
      console.error("failed to load candles");
      return;
    }

    // Если свечи загружены не все
    if (gP.minTime < gP.minLoadedTime && !gP.loadingCandles) {
      gP.loadingCandles = true;
      this.getData({ symbol: gP.symbol, type: "candlesticks", endTime: gP.minLoadedTime - 1, candlesTime: gP.candlesTime });
    }

    // Инициализация шкалы цен
    let yScale: d3.ScaleLinear<number, number>;
    if (gP.autoscale) {
      gP.minPrice = 100000000;
      gP.maxPrice = -1;
    }
    gP.maxVolume = 0;
    gP.candles.forEach(e => {
      if (e[0] < gP.minTime || e[0] > gP.maxTime) return;
      if (gP.maxVolume < e[5]) {
        gP.maxVolume = parseInt(e[5]);
      }
      if (gP.autoscale) {
        if (gP.maxPrice < e[2]) {
          gP.maxPrice = parseInt(e[2]);
        }
        if (gP.minPrice > e[3]) {
          gP.minPrice = parseInt(e[3]);
        }
      }
    });

    if (gP.autoscale) {
      yScale = d3.scaleLinear()
        .domain([gP.minPrice, gP.maxPrice])
        .range([gP.height - 10, 10]);
    } else {
      yScale = d3.scaleLinear()
        .domain([gP.minPrice, gP.maxPrice])
        .range([gP.height - 10, 10]);
    }

    // Инициализация шкалы времени
    let xScale: d3.ScaleTime<number, number>;
    xScale = d3.scaleTime()
      .domain([gP.minTime, gP.maxTime])
      .range([-gP.candleWide, gP.width])



    // Инициализация шкалы объемов
    let yVolumeScale: d3.ScaleLinear<number, number>;
    yVolumeScale = d3.scaleLinear()
      .domain([0, gP.maxVolume])
      .range([0, 50])

    // Заполнение квадрата белым цветом
    graphContext.fillStyle = gP.backgroundColor;
    graphContext.fillRect(0, 0, gP.width, gP.height);

    //#endregion Инициалиация рисования

    //Рисование ценовой шкалы
    function drawVerticalScale() {
      let ticks = yScale.ticks();

      priceContext.fillStyle = gP.backgroundColor;
      priceContext.fillRect(0, 0, gP.verticalScaleWidth, gP.height);

      // Рисование цен
      priceContext.fillStyle = "black";
      priceContext.font = '24px serif';
      ticks.forEach(i => {
        priceContext.fillText(i, 0, yScale(i));
      })
    }

    // Рисование шкалы времени
    function drawHorizontalScale() {
      let ticks = xScale.ticks();

      timeContext.fillStyle = gP.backgroundColor;
      timeContext.fillRect(0, 0, gP.width, gP.horizontalScaleHeight);

      // Рисование дат
      timeContext.fillStyle = "black";

      const shadowShift = Math.floor(gP.candleWide / 2);

      ticks.forEach(i => {
        timeContext.font = '20px serif';
        let text = "";
        const date = new Date(i);
        // Как рисовать дату
        if (date.getHours().toString() == "0") {
          text = `${date.getDate().toString().padStart(2, "0")}`
          timeContext.font = 'bold ' + timeContext.font;
        } else {
          text = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
        }
        const textWidth = timeContext.measureText(text).width;
        timeContext.fillText(text, xScale(i) - textWidth / 2 + shadowShift, 17);
        // Палочки на датах
        timeContext.fillStyle = "black";
        timeContext.fillRect(xScale(i) + shadowShift, 0, 1, 3)
      })
    }

    // Рисование свечей
    function drawCandles() {
      let shadowShift = Math.floor(gP.candleWide / 2)

      gP.candles.slice().reverse().forEach((e) => {
        if (e[0] < gP.minTime || e[0] > gP.maxTime) return;
        // [0] time, [1] open, [2] high, [3] low, [4] close, [5] volume, 
        // [6] closeTime, [7] assetVolume, [8] trades, [9] buyBaseVolume, [10] buyAssetVolume, [11] ignored
        if (parseFloat(e[1]) <= parseFloat(e[4])) {
          graphContext.fillStyle = 'green';
          // Тень
          graphContext.fillRect(xScale(e[0]) + shadowShift, yScale(e[3]), 1, yScale(e[2]) - yScale(e[3]));
          // Свеча
          graphContext.fillRect(xScale(e[0]) + 1, yScale(e[1]), gP.candleWide - 2, yScale(e[4]) - yScale(e[1]));
        } else {
          graphContext.fillStyle = 'red';
          // Тень
          graphContext.fillRect(xScale(e[0]) + shadowShift, yScale(e[3]), 1, yScale(e[2]) - yScale(e[3]));
          // Свеча
          graphContext.fillRect(xScale(e[0]) + 1, yScale(e[1]), gP.candleWide - 2, yScale(e[4]) - yScale(e[1]));
        }
        drawVolumes(e);
      });
    }

    // Рисование объемов
    function drawVolumes(e) {
      graphContext.fillRect(xScale(e[0]) + 1, gP.height, gP.candleWide - 2, -yVolumeScale(e[5]))
    }

    // Рисование курсора
    function drawMouseCross() {
      // Сам курсор
      graphContext.fillStyle = "black";
      graphContext.beginPath();
      graphContext.moveTo(gP.mouseCoords.x, 0);
      graphContext.lineTo(gP.mouseCoords.x, gP.height);
      graphContext.closePath();
      graphContext.stroke();
      graphContext.beginPath();
      graphContext.moveTo(0, gP.mouseCoords.y);
      graphContext.lineTo(gP.width, gP.mouseCoords.y);
      graphContext.closePath();
      graphContext.stroke();

      // Курсор с датой
      const date = new Date(xScale.invert(gP.mouseCoords.x));
      const text = `${date.getDate().toString().padStart(2, "0")}.${date.getMonth().toString().padStart(2, "0")}.${date.getFullYear().toString().slice(2)} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      const textWidth = timeContext.measureText(text).width;
      timeContext.fillStyle = "white";
      timeContext.strokeStyle = "black";
      timeContext.fillRect(gP.mouseCoords.x - textWidth / 2, 0, textWidth, gP.horizontalScaleHeight)
      timeContext.strokeRect(gP.mouseCoords.x - textWidth / 2, 0, textWidth, gP.horizontalScaleHeight)
      timeContext.fillStyle = "black";
      timeContext.fillText(text, gP.mouseCoords.x - textWidth / 2, 17);

      // Курсор с ценой
      priceContext.fillStyle = "white";
      priceContext.strokeStyle = "black";
      priceContext.fillRect(0, gP.mouseCoords.y - 20, gP.verticalScaleWidth, 40)
      priceContext.strokeRect(0, gP.mouseCoords.y - 20, gP.verticalScaleWidth, 40)
      priceContext.fillStyle = "black";
      priceContext.fillText(yScale.invert(gP.mouseCoords.y), 0, gP.mouseCoords.y + 7);
    }

    // Рисование линии последней цены
    function drawLastPrice() {
      const candle = gP.candles[gP.candles.length - 1];

      // Сама линия
      graphContext.fillStyle = "black";
      graphContext.beginPath();
      graphContext.moveTo(0, yScale(candle[4]))
      graphContext.lineTo(gP.width, yScale(candle[4]))
      graphContext.closePath();
      graphContext.stroke();

      // Курсор с ценой
      priceContext.fillStyle = "white";
      priceContext.strokeStyle = "black";
      priceContext.fillRect(0, yScale(candle[4]) - 20, gP.verticalScaleWidth, 40)
      priceContext.strokeRect(0, yScale(candle[4]) - 20, gP.verticalScaleWidth, 40)
      priceContext.fillStyle = "black";
      priceContext.fillText(candle[4], 0, yScale(candle[4]) + 7);
    }

    // После инициализации всего рисуем по частям
    drawCandles();
    drawVerticalScale();
    drawHorizontalScale();
    drawLastPrice();
    if (gP.mouseOver) drawMouseCross();
  }

  switchAutoscale() {
    this.graphicProperties.autoscale = !this.graphicProperties.autoscale
    this.redraw();
  }

  //#region MOUSE_EVENTS

  //#region MOUSE_GRAPHIC_EVENTS
  onMouseOver(e) {
    this.graphicProperties.mouseOver = true;
    this.redraw();
  }

  onMouseLeave(e) {
    this.graphicProperties.mouseOver = false;
    this.redraw();
  }

  onMouseWheel(e) {
    e.preventDefault();
    if (e.deltaY > 0) {
      this.graphicProperties.minTime /= 1.000001
    } else {
      this.graphicProperties.minTime *= 1.000001
    }

    this.changeCandlesWidth();

    this.redraw();
  }

  onMouseDown(e) {
    if (e.which != 1) {
      return;
    }
    let currX = e.screenX;
    let currY = e.screenY;
    let gP = this.graphicProperties;

    let mover = (event) => {
      event.preventDefault();
      let differenceX = (gP.maxTime - gP.minTime) / gP.width;
      gP.maxTime -= (event.screenX - currX) * differenceX;
      gP.minTime -= (event.screenX - currX) * differenceX;
      currX = event.screenX;
      if (!gP.autoscale) {
        let differenceY = (gP.maxPrice - gP.minPrice) / gP.height;
        gP.maxPrice += (event.screenY - currY) * differenceY;
        gP.minPrice += (event.screenY - currY) * differenceY;
        currY = event.screenY;
      }
      if (!gP.mouseOver) this.redraw()
    }

    let upper = (event) => {
      event.preventDefault();
      document.removeEventListener("mousemove", mover)
      document.removeEventListener("mouseup", upper)
    }

    document.addEventListener("mousemove", mover);

    document.addEventListener("mouseup", upper)
  }

  // Отрабтка движений мыши на графике
  onMouseMove(e) {
    e.preventDefault();
    if (this.graphicProperties.candles.length > 0) {
      this.graphicProperties.mouseCoords.x = e.offsetX;
      this.graphicProperties.mouseCoords.y = e.offsetY;
      this.redraw();
    }
  }

  //#endregion MOUSE_GRAPHIC_EVENTS

  //#region MOUSE_PRICE_EVENTS

  onMouseDownPrice(e) {
    if (e.which != 1) {
      return;
    }

    let currY = e.screenY;
    let gP = this.graphicProperties;

    gP.autoscale = false;

    let mover = (event) => {
      event.preventDefault();
      let differenceY = (gP.maxPrice - gP.minPrice) / gP.height;
      gP.maxPrice += (event.screenY - currY) * differenceY;
      gP.minPrice -= (event.screenY - currY) * differenceY;
      currY = event.screenY;
      this.redraw();
    }

    let upper = (event) => {
      event.preventDefault();
      document.removeEventListener("mousemove", mover)
      document.removeEventListener("mouseup", upper)
    }

    document.addEventListener("mousemove", mover);

    document.addEventListener("mouseup", upper)
  }

  //#endregion MOUSE_PRICE_EVENTS

  //#region MOUSE_TIME_EVENTS

  onMouseDownTime(e) {
    if (e.which != 1) {
      return;
    }

    let currX = e.screenX;
    let gP = this.graphicProperties;

    let mover = (event) => {
      event.preventDefault();
      let differenceX = (gP.maxTime - gP.minTime) / gP.width;
      gP.maxTime += (event.screenX - currX) * differenceX;
      gP.minTime -= (event.screenX - currX) * differenceX;
      currX = event.screenX;
      this.changeCandlesWidth();

      this.redraw();
    }

    let upper = (event) => {
      event.preventDefault();
      document.removeEventListener("mousemove", mover)
      document.removeEventListener("mouseup", upper)
    }

    document.addEventListener("mousemove", mover);

    document.addEventListener("mouseup", upper)
  }

  //#endregion MOUSE_TIME_EVENTS

  //#endregion MOUSE_EVENTS

  // Выбор времени свечек
  changeCandlesTime(e) {
    let gP = this.graphicProperties;

    if (this.subbed) {
      this.kline.unsubscribe();
      this.candles.unsubscribe();
      this.unsubscribeData({ symbol: gP.symbol, type: "kline", candlesTime: gP.candlesTime })
    }

    const timeDiff = gP.maxTime - gP.minTime;
    const timesDiff = this.times[gP.candlesTime] / this.times[e];
    gP.minTime = gP.maxTime - timeDiff / timesDiff

    gP.candlesTime = e;
    gP.candles = [];
    this.getData({ symbol: gP.symbol, type: "candlesticks", candlesTime: e })
    this.subscribeData({ symbol: gP.symbol, type: "kline", candlesTime: e })

    // Подписка на получение данных с сервака
    this.candles = this.wsh.dataStorage.candlesticks[gP.symbol + "@candlesticks_" + gP.candlesTime].subscribe((data) => {
      // Получение множества свечек
      this.graphicProperties.loadingCandles = false;
      this.graphicProperties.minLoadedTime = data[0][0];
      this.graphicProperties.candles.unshift(...data);
      this.graphicProperties.candles = Array.from(new Set(this.graphicProperties.candles));
      this.changeCandlesWidth();
      this.redraw();
    });

    // Получение последней свечки
    // data['k'] {t, o, h, l, c, v}
    this.kline = this.wsh.dataStorage.kline[gP.symbol + "@kline_" + gP.candlesTime].subscribe((data) => {
      if (this.graphicProperties.candles.length) {
        try {
          if (this.graphicProperties.candles[this.graphicProperties.candles.length - 1][0] == data['k'].t) {
            this.graphicProperties.candles[this.graphicProperties.candles.length - 1][2] = data['k'].h;
            this.graphicProperties.candles[this.graphicProperties.candles.length - 1][3] = data['k'].l;
            this.graphicProperties.candles[this.graphicProperties.candles.length - 1][4] = data['k'].c;
            this.graphicProperties.candles[this.graphicProperties.candles.length - 1][5] = data['k'].v;
          } else {
            this.graphicProperties.candles.push([data['k'].t, data['k'].o, data['k'].h, data['k'].l, data['k'].c, data['k'].v]);
            this.graphicProperties.maxTime += 60 * 1000;
            this.graphicProperties.minTime += 60 * 1000;
          }
          this.redraw();
        } catch (e) {
          console.error(e);
        }
      }
    });

    this.changeCandlesWidth();
  }

  // Адаптация ширины свечек
  changeCandlesWidth() {
    let gP = this.graphicProperties;
    const timeDiff = gP.maxTime - gP.minTime;
    const candlesCount = Math.floor(timeDiff / this.times[gP.candlesTime]);
    const candleWidth = Math.floor(gP.width / candlesCount);

    if (candleWidth % 2 === 0) {
      gP.candleWide = candleWidth - 1;
    } else {
      gP.candleWide = candleWidth;
    }
  }

  ngOnInit() {
    this.connect();
    this.changeCandlesTime("1m");
    this.subbed = true;
  }

  graphicResized(e) {
    this.graphicProperties.width = e.newWidth;
    this.graphicProperties.height = e.newHeight;

    if (!this.viewLoaded) { return };

    this.graphCanvas = this.graphCanvas
      .attr("width", this.graphicProperties.width)
      .attr("height", this.graphicProperties.height);

    this.priceCanvas = this.priceCanvas
      .attr("height", this.graphicProperties.height);

    this.timeCanvas = this.timeCanvas
      .attr("width", this.graphicProperties.width);

    this.changeCandlesWidth();

    this.redraw();
  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {
    this.viewLoaded = true;
    // Инициализация канваса графика
    this.graphCanvas = d3.select('#graphic-' + this.number).select('canvas')
      .attr("width", this.graphicProperties.width)
      .attr("height", this.graphicProperties.height);
    this.graphContext = this.graphCanvas.node().getContext('2d');

    // Инициализация канваса цены
    this.priceCanvas = d3.select('#price-' + this.number).select('canvas')
      .attr("width", this.graphicProperties.verticalScaleWidth)
      .attr("height", this.graphicProperties.height);
    this.priceContext = this.priceCanvas.node().getContext('2d');

    // Инициализация канваса времени
    this.timeCanvas = d3.select('#time-' + this.number).select('canvas')
      .attr("height", this.graphicProperties.horizontalScaleHeight)
      .attr("width", this.graphicProperties.width);
    this.timeContext = this.timeCanvas.node().getContext('2d');
  }

  ngOnDestroy() {
    this.unsubscribeData(this.graphicProperties.symbol+'@kline_'+this.graphicProperties.candlesTime);
  }
}
