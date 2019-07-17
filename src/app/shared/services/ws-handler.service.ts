import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WsHandlerService {
  public dataStorage = {trade: new Subject<object>()};


  public handleInput(data) {
    this.dataStorage.trade.next(data);
  }

  constructor() { }
}
