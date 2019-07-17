import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Message, WebsocketService} from '../../shared/services/websocket.service';
import * as d3 from 'd3';
import {WsHandlerService} from '../../shared/services/ws-handler.service';
import conf from '../../../assets/configs/graphic.json';

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

  constructor(private ws: WebsocketService,
              private wsh: WsHandlerService) {
  }

  subscribe() {
    this.ws.connect();
    const msg = new Message('sub', 'btcusdt@trade');
    this.ws.subscribe(msg);
  }

  unsubscribe() {
    const msg = new Message('unsub', 'btcusdt@trade');
    this.ws.unsubscribe(msg);
    this.ws.disconnect();
  }

  redraw(data) {
    // Заполнение квадрата белым цветом
    this.context.fillStyle = conf['background-color'];
    this.context.fillRect(0, 0, conf.width, conf.height);

    // Объявление вертикальной шкалы
    const yScale = d3.scaleLinear()
      .domain([0, Math.max(data.makers, data.takers) * 1.1])
      .range([0, conf.height]);

    /*
    @
    @   Рисование левой шкалы
    @
    @
    @
    @
    @
    */
    // Рисование вертикальной палочки
    this.context.fillStyle = 'black';
    this.context.beginPath();
    this.context.moveTo(40, 0);
    this.context.lineTo(40, conf.height);
    this.context.closePath();
    this.context.stroke();

    // Рисование цифр
    const step = Math.max(data.makers, data.takers) * 0.11;
    for (let i = step; i < step * 10; i += step) {
      this.context.font = '24px serif';
      this.context.fillText(i, 40, conf.height - yScale(i));
    }

    /*
    @
    @   Рисование баров с объемами
    @
    @
    @
    @
    @
    */
    this.context.fillStyle = 'green';
    this.context.fillRect(150, 500, 100, -yScale(data.takers));
    this.context.fillStyle = 'red';
    this.context.fillRect(350, 500, 100, -yScale(data.makers));
  }


  ngOnInit() {
    this.wsh.dataStorage.trade.subscribe((data) => this.redraw(data));

    this.canvas = d3.select('#graphic').append('canvas')
      .attr('width', conf.width)
      .attr('height', conf.height);

    this.context = this.canvas.node().getContext('2d');
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    const msg = new Message('unsub', 'btcusdt@trade');
    this.ws.disconnect();
  }

}
