import { ElementRef } from "@angular/core";
import { Canvas } from "./canvas.class";

export class TimeCanvas extends Canvas {
  constructor(element: ElementRef) {
    super(element);
  }
}
