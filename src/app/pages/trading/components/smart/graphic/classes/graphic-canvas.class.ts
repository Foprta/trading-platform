import { ElementRef } from "@angular/core";
import { Canvas } from "./canvas.class";

export class GraphicCanvas extends Canvas {
  constructor(element: ElementRef) {
    super(element);
  }

  public drawCandleBody({open, high, low, close}) {
    if (open > close) {
        this.context.fillStyle = "green";
    } else {
        this.context.fillStyle = "red";
    }

    this.context.fillRect(this.xScale(100), 100, this.xScale(200), 200);
  }
}
