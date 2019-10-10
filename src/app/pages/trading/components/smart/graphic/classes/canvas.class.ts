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
  protected offsetX: number = 0;
  protected offsetY: number = 0;

  public get getElementWidth(): number {
    return this.elementRef.nativeElement.width;
  }

  public get getElementHeight(): number {
    return this.elementRef.nativeElement.height;
  }

  public getInvertedX(input): number {
    return this.xScale.invert(input)
  }

  public getInvertedY(input): number {
    return this.yScale.invert(input)
  }

  constructor(element: ElementRef) {
    this.elementRef = element;
    this.context = element.nativeElement.getContext("2d");
  }

  public setDraggedOffsets(differenceX, differenceY) {
    this.offsetX -= differenceX;
    this.offsetY -= differenceY;
  }

  public setXScale(minTime: number, maxTime: number) {
    this.xScale = d3
      .scaleLinear()
      .domain([minTime + this.offsetX, maxTime + this.offsetX])
      .range([0, this.elementRef.nativeElement.width]);
  }

  public setYScale(minPrice: number, maxPrice: number) {
    this.yScale = d3
      .scaleLinear()
      .domain([minPrice + this.offsetY, maxPrice + this.offsetY])
      .range([this.elementRef.nativeElement.height - 10, 10]);
  }

  public drawBackground() {
    this.context.fillStyle = "white";
    this.context.fillRect(
      0,
      0,
      this.elementRef.nativeElement.width,
      this.elementRef.nativeElement.height
    );
  }
}
