import { ElementRef } from "@angular/core";
import { Canvas } from "./canvas.class";

export class GraphicCanvas extends Canvas {
  constructor(element: ElementRef) {
    super(element);
  }

  public drawCursor(x, y) {
    this.context.fillStyle = "black";

    this.context.fillRect(x, 0, 1, this.elementRef.nativeElement.height)
    this.context.fillRect(0, y, this.elementRef.nativeElement.width, 1)
  }

  public drawCandleBody({ open, close, time }) {
    if (open < close) {
      this.context.fillStyle = "green";
    } else {
      this.context.fillStyle = "red";
    }

    this.context.fillRect(this.xScale(time), this.yScale(open), 1, this.yScale(close)-this.yScale(open));
  }
}
