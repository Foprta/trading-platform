import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Message, WebsocketService } from '../../shared/services/websocket.service';
import * as d3 from 'd3';
import { WsHandlerService } from '../../shared/services/ws-handler.service';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnDestroy, AfterContentInit {
  graphCanvas: any;
  graphContext: any;
  timeCanvas: any;
  timeContext: any;
  priceCanvas: any;
  priceContext: any;
  customBase = document.createElement('custom');
  custom = d3.select(this.customBase);
  conf = {
    width: 0,
    height: 0,
    verticalScaleWidth: 80,
    horizontalScaleHeight: 40,
    backgroundColor: "white"
  };
  graphicProperties = {
    loadingCandles: false,
    minLoadedTime: 0,
    maxPrice: 0,
    minPrice: 0,
    maxTime: Date.now().valueOf() + 60 * 1000 * 10,
    minTime: Date.now().valueOf() - 1000 * 60 * 100,
    realCandleWide: 0,
    candleWide: 0,
    candles: [],
    mouseCoords: { x: -1, y: -1 },
    candlesTime: 1000 * 60,
    autoscale: true,
    mouseOver: false
  }

  constructor(private ws: WebsocketService,
    private wsh: WsHandlerService) {
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
  subscribeData(symbol) {
    const msg = new Message('sub', symbol);
    this.ws.subscribeData(msg);
  }

  // Отписка
  unsubscribeData(symbol) {
    const msg = new Message('unsub', symbol);
    this.ws.unsubscribeData(msg);
  }

  getData(symbol, time?: number) {
    const msg = new Message('get', symbol, time);
    this.graphicProperties.loadingCandles = true;
    this.ws.getData(msg);
  }

  //#endregion WS_EVENTS

  log(e) {
    console.log(e)
  }

  redraw() {
    // Для нормальной работы скопов
    let conf = this.conf;
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
      this.getData("BTCUSDT@candlesticks", gP.minLoadedTime - 1);
    }

    // Инициализация шкалы цен
    let yScale: d3.ScaleLinear<number, number>;
    if (gP.autoscale) {
      gP.minPrice = 100000000;
      gP.maxPrice = -1;
      gP.candles.forEach(e => {
        if (e[0] < gP.minTime || e[0] > gP.maxTime) return;
        if (gP.maxPrice < e[2]) {
          gP.maxPrice = parseInt(e[2]);
        }
        if (gP.minPrice > e[3]) {
          gP.minPrice = parseInt(e[3]);
        }
      });

      yScale = d3.scaleLinear()
        .domain([gP.minPrice, gP.maxPrice])
        .range([conf.height - 10, 10]);
    } else {
      yScale = d3.scaleLinear()
        .domain([gP.minPrice, gP.maxPrice])
        .range([conf.height - 10, 10]);
    }

    // Инициализация шкалы времени
    let xScale: d3.ScaleTime<number, number>;
    xScale = d3.scaleTime()
      .domain([gP.minTime, gP.maxTime])
      .range([-gP.candleWide, conf.width])

    // Заполнение квадрата белым цветом
    graphContext.fillStyle = conf.backgroundColor;
    graphContext.fillRect(0, 0, conf.width, conf.height);


    //Рисование ценовой шкалы
    function drawVerticalScale() {
      priceContext.fillStyle = conf.backgroundColor;
      priceContext.fillRect(0, 0, conf.verticalScaleWidth, conf.height);

      // Рисование цен
      priceContext.fillStyle = "black";
      const step = (gP.maxPrice - gP.minPrice) * 0.11;
      for (let i = gP.minPrice + step / 2; i < gP.maxPrice; i += step) {
        priceContext.font = '24px serif';
        priceContext.fillText(i, 0, yScale(i));
      }

      // Курсор с ценой
      if (gP.mouseOver) {
        priceContext.fillStyle = "white";
        priceContext.strokeStyle = "black";
        priceContext.fillRect(0, gP.mouseCoords.y - 20, conf.verticalScaleWidth, 40)
        priceContext.strokeRect(0, gP.mouseCoords.y - 20, conf.verticalScaleWidth, 40)
        priceContext.fillStyle = "black";
        priceContext.fillText(yScale.invert(gP.mouseCoords.y), 0, gP.mouseCoords.y + 7);
      }
    }

    // Рисование шкалы времени
    function drawHorizontalScale() {
      timeContext.fillStyle = conf.backgroundColor;
      timeContext.fillRect(0, 0, conf.width, conf.horizontalScaleHeight);

      // Рисование дат
      const step = (gP.maxTime - gP.minTime) * 0.11;
      timeContext.fillStyle = "black";
      for (let i = gP.minTime + step / 2; i < gP.maxTime; i += step) {
        timeContext.font = '24px serif';
        timeContext.fillText(new Date(i).getMinutes(), xScale(i), 30);
      }

      // Курсор с датой
      if (gP.mouseOver) {
        timeContext.fillStyle = "white";
        timeContext.strokeStyle = "black";
        timeContext.fillRect(gP.mouseCoords.x - 50, 0, 100, conf.horizontalScaleHeight)
        timeContext.strokeRect(gP.mouseCoords.x - 50, 0, 100, conf.horizontalScaleHeight)
        timeContext.fillStyle = "black";
        timeContext.fillText(new Date(xScale.invert(gP.mouseCoords.x)).getMinutes(), gP.mouseCoords.x, 30);
      }
    }

    // Рисование свечей
    function drawCandles() {
      let shadowShift = Math.floor(gP.candleWide / 2)

      gP.candles.slice().reverse().forEach((e, i) => {
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
      });
    }

    // Рисование курсора
    function drawMouseCross() {
      graphContext.fillStyle = "black";
      graphContext.beginPath();
      graphContext.moveTo(gP.mouseCoords.x, 0);
      graphContext.lineTo(gP.mouseCoords.x, conf.height);
      graphContext.closePath();
      graphContext.stroke();
      graphContext.beginPath();
      graphContext.moveTo(0, gP.mouseCoords.y);
      graphContext.lineTo(conf.width, gP.mouseCoords.y);
      graphContext.closePath();
      graphContext.stroke();
    }

    // После инициализации всего рисуем по частям
    drawCandles();
    drawVerticalScale();
    drawHorizontalScale();
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
    let prevWindow = this.graphicProperties.maxTime - this.graphicProperties.minTime;
    if (e.deltaY > 0) {
      this.graphicProperties.minTime /= 1.000001
      let currentWindow = this.graphicProperties.maxTime - this.graphicProperties.minTime;
      this.graphicProperties.realCandleWide *= prevWindow / currentWindow;
    } else {
      this.graphicProperties.minTime *= 1.000001
      let currentWindow = this.graphicProperties.maxTime - this.graphicProperties.minTime;
      this.graphicProperties.realCandleWide *= prevWindow / currentWindow;
    }

    this.graphicProperties.candleWide = Math.floor(this.graphicProperties.realCandleWide);
    if (this.graphicProperties.candleWide % 2 === 0) {
      this.graphicProperties.candleWide--;
    }

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
      let differenceX = (gP.maxTime - gP.minTime) / this.conf.width;
      gP.maxTime -= (event.screenX - currX) * differenceX;
      gP.minTime -= (event.screenX - currX) * differenceX;
      currX = event.screenX;
      if (!gP.autoscale) {
        let differenceY = (gP.maxPrice - gP.minPrice) / this.conf.height;
        gP.maxPrice += (event.screenY - currY) * differenceY;
        gP.minPrice += (event.screenY - currY) * differenceY;
        currY = event.screenY;
      }
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
      let differenceY = (gP.maxPrice - gP.minPrice) / this.conf.height;
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
      let prevWindow = gP.maxTime - gP.minTime;
      let differenceX = (gP.maxTime - gP.minTime) / this.conf.width;
      gP.maxTime += (event.screenX - currX) * differenceX;
      gP.minTime -= (event.screenX - currX) * differenceX;
      currX = event.screenX;
      let currentWindow = gP.maxTime - gP.minTime;
      gP.realCandleWide *= prevWindow / currentWindow;
      
      gP.candleWide = Math.floor(gP.realCandleWide);
      if (gP.candleWide % 2 === 0) {
        gP.candleWide--;
      }
  


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

  ngOnInit() {
    // Подписка на получение данных с сервака
    this.wsh.dataStorage.candlesticks.subscribe((data) => {
      // ПОлучение множества свечек
      this.graphicProperties.loadingCandles = false;
      this.graphicProperties.minLoadedTime = data[0][0];
      this.graphicProperties.candles.unshift(...data);
      if (this.graphicProperties.realCandleWide === 0) {
        this.graphicProperties.realCandleWide = this.conf.width / 100;
      }
      this.graphicProperties.candleWide = Math.round(this.graphicProperties.realCandleWide);
      if (this.graphicProperties.candleWide % 2 === 0) {
        this.graphicProperties.candleWide--;
      }
      this.redraw();
    });

    // Получение последней свечки
    // data['k'] {t, o, h, l, c, v}
    this.wsh.dataStorage.candlestick.subscribe((data) => {
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

    // Инициализация канваса графика
    this.graphCanvas = d3.select('#graphic').select('canvas')
    this.graphContext = this.graphCanvas.node().getContext('2d');

    // Инициализация канваса цены
    this.priceCanvas = d3.select('#price-scale').select('canvas')
      .attr("width", this.conf.verticalScaleWidth)
    this.priceContext = this.priceCanvas.node().getContext('2d');

    // Инициализация канваса времени
    this.timeCanvas = d3.select('#time-scale').select('canvas')
      .attr("height", this.conf.horizontalScaleHeight);
    this.timeContext = this.timeCanvas.node().getContext('2d');

    this.connect()
    this.getData("BTCUSDT@candlesticks")
    this.subscribeData("BTCUSDT@kline_1m")
  }

  graphicResized(e) {
    this.conf.width = e.newWidth;
    this.conf.height = e.newHeight;

    this.graphCanvas = d3.select('#graphic').select('canvas')
      .attr("width", this.conf.width)
      .attr("height", this.conf.height);

    this.priceCanvas = d3.select('#price-scale').select('canvas')
      .attr("height", this.conf.height);

    this.timeCanvas = d3.select('#time-scale').select('canvas')
      .attr("width", this.conf.width);

    let difference = e.newWidth / e.oldWidth;
    if (this.graphicProperties.realCandleWide !== 0) {
      this.graphicProperties.realCandleWide *= difference;
    }
    this.graphicProperties.candleWide = Math.round(this.graphicProperties.realCandleWide);
    if (this.graphicProperties.candleWide % 2 === 0) {
      this.graphicProperties.candleWide--;
    }

    this.redraw();
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    this.unsubscribeData('BTCUSDT@kline_1m');
  }

}
