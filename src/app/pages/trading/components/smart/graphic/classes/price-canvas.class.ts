import { ElementRef } from "@angular/core";
import { Canvas } from "./canvas.class";

export class PriceCanvas extends Canvas {
  private _autoscale: boolean = true;

  constructor(element: ElementRef) {
    super(element);
  }

  public setAutoscale(state: boolean) {
    this._autoscale = state;
  }
}
