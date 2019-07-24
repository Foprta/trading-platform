import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Message, WebsocketService} from '../../shared/services/websocket.service';
import * as d3 from 'd3';
import {WsHandlerService} from '../../shared/services/ws-handler.service';
import conf from '../../../assets/configs/graphic.json';
import { geoPath } from 'd3';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnDestroy, AfterContentInit {
  canvas: any;
  context: any;
  customBase = document.createElement('custom');
  custom = d3.select(this.customBase);
  graphicProperties = {
    maxPrice: 0,
    minPrice: 0,
    candleWide: 3,
    candles: [],
    mouseCoords: {x:-1,y:-1}
  }

  constructor(private ws: WebsocketService,
              private wsh: WsHandlerService) {
  }

  // Подключение к ВебСокету
  connect() {
    this.ws.connect();
  }

  // Отключение от ВебСокета
  disconnect() {
    this.ws.disconnect();
  }

  // Создание подписки
  subscribe(symbol) {
    const msg = new Message('sub', symbol);
    this.ws.subscribe(msg);
  }

  // Отписка
  unsubscribe(symbol) {
    const msg = new Message('unsub', symbol);
    this.ws.unsubscribe(msg);
  }

  redraw() {
    // Для нормальной работы скопов
    let gP = this.graphicProperties;
    let context = this.context;
    let yScale: d3.ScaleLinear<number, number>; // Объявление вертикальной шкалы

    if (gP.candles.length == 0) {
      console.error("failed to load candles");
      return;
    }

    // Заполнение квадрата белым цветом
    context.fillStyle = conf['background-color'];
    context.fillRect(0, 0, conf.width, conf.height);

    //Рисование левой шкалы
    function drawVerticalScale() {
      gP.minPrice = 100000000;
      gP.maxPrice = -1;
      gP.candles.forEach(e => {
        if (gP.maxPrice < e[2]) {
          gP.maxPrice = parseInt(e[2]);
        }
        if (gP.minPrice > e[3]) {
          gP.minPrice = parseInt(e[3]);
        }
      });

      yScale = d3.scaleLinear()
      .domain([gP.minPrice, gP.maxPrice])
      .range([conf.height, 0]);

      // Рисование вертикальной палочки
      context.fillStyle = 'black';
      context.beginPath();
      context.moveTo(40, 0);
      context.lineTo(40, conf.height);
      context.closePath();
      context.stroke();

      // Рисование цифр
      const step = (gP.maxPrice-gP.minPrice) * 0.11;
      for (let i = gP.minPrice + step/2; i < gP.maxPrice; i += step) {
        context.font = '24px serif';
        context.fillText(i, 40, yScale(i));
      }
    }

  // Рисование свечей
    function drawCandles() {
      let wide = (conf.width-40) / gP.candles.length;
      gP.candles.forEach((e, i) => {
        // [0] time, [1] open, [2] high, [3] low, [4] close, [5] volume, 
        // [6] closeTime, [7] assetVolume, [8] trades, [9] buyBaseVolume, [10] buyAssetVolume, [11] ignored
        if (parseFloat(e[1]) <= parseFloat(e[4])) {
          context.fillStyle = 'green';
          context.fillRect(40+wide*i+1, yScale(e[3]), 1, yScale(e[2])-yScale(e[3]));
          context.fillRect(40+wide*i, yScale(e[1]), wide, yScale(e[4])-yScale(e[1]));          
        } else {
          context.fillStyle = 'red';
          context.fillRect(40+wide*i+1, yScale(e[3]), 1, yScale(e[2])-yScale(e[3]));
          context.fillRect(40+wide*i, yScale(e[1]), wide, yScale(e[4])-yScale(e[1]));
        }
      });
    }    

      // Рисование свечей
      function drawMouseCross() {
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(gP.mouseCoords.x, 0);
        context.lineTo(gP.mouseCoords.x, conf.height);      
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(0, gP.mouseCoords.y);
        context.lineTo(conf.width, gP.mouseCoords.y);      
        context.closePath();
        context.stroke();
      }    

    // ПОсле инициализации всего рисуем по частям
    drawVerticalScale();
    drawCandles();
    drawMouseCross();
  }

  // Отрабтка движений мыши на графике
  onMouseMove(e) {
    this.graphicProperties.mouseCoords.x=e.offsetX;
    this.graphicProperties.mouseCoords.y=e.offsetY;
    if (this.graphicProperties.candles.length > 0) this.redraw();
  }

  ngOnInit() {
    // Подписка на получение данных с сервака
    this.wsh.dataStorage.candlesticks.subscribe((data) => {
      this.graphicProperties.candles = data;
      this.redraw();
    });
    
    // data['k'] {t, o, h, l, c, v}
    this.wsh.dataStorage.candlestick.subscribe((data) => {
      try {
        if (this.graphicProperties.candles[this.graphicProperties.candles.length-1][0] == data['k'].t) {
          this.graphicProperties.candles[this.graphicProperties.candles.length-1][2] = data['k'].h;
          this.graphicProperties.candles[this.graphicProperties.candles.length-1][3] = data['k'].l;
          this.graphicProperties.candles[this.graphicProperties.candles.length-1][4] = data['k'].c;
          this.graphicProperties.candles[this.graphicProperties.candles.length-1][5] = data['k'].v;
        } else {
          this.graphicProperties.candles.push([data['k'].t, data['k'].o, data['k'].h, data['k'].l, data['k'].c, data['k'].v]);
        }
        this.redraw();
      } catch(e) {
        console.error(e);
      }
    });

    // Инициализация канваса
    this.canvas = d3.select('#graphic').append('canvas')
      .attr('width', conf.width)
      .attr('height', conf.height);
    this.context = this.canvas.node().getContext('2d');

    this.connect()
    this.subscribe("BTCUSDT@kline_1m")
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    this.unsubscribe('BTCUSDT@candles');
  }

}
