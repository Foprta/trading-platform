import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TradingFunctionsService {

  constructor() { }

  call() {
    console.log("calling")
  }
}
