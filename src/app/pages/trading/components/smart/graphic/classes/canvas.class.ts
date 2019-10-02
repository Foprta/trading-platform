import { ElementRef } from "@angular/core";
import * as d3 from "d3";

export abstract class Canvas {
  protected context: any;
  protected elementRef: ElementRef;
  protected yScale = d3
    .scaleLinear()
    .domain([0, 0])
    .range([0, 0]);
  protected xScale = d3
    .scaleLinear()
    .domain([0, 0])
    .range([0, 0]);

  constructor(element: ElementRef) {
    this.elementRef = element;
    this.context = element.nativeElement.getContext("2d");
  }

  public rescaleX(minTime: number, maxTime: number) {
    this.xScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([0, this.elementRef.nativeElement.width]);
  }

  public rescaleY(minPrice: number, maxPrice: number) {
    this.yScale = d3
      .scaleLinear()
      .domain([minPrice, maxPrice])
      .range([this.elementRef.nativeElement.height - 10, 10]);
  }
}
