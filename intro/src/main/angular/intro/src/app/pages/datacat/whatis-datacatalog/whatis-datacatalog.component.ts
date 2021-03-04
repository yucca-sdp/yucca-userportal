/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// import * as d3 from 'd3';
import { $ } from 'protractor';

@Component({
  selector: 'app-whatis-datacatalog',
  templateUrl: './whatis-datacatalog.component.html',
  styleUrls: ['./whatis-datacatalog.component.sass']
})
export class WhatisDatacatalogComponent implements OnInit {

  constructor(/*private staticHtmlService: StaticHtmlService,*/ private domSanitizer: DomSanitizer) { }

  htmlContet: SafeHtml;
  faArrowLeft = faArrowLeft;


  @ViewChild("page") elPage: ElementRef;
  @ViewChild("spacer1") elSpacer1: ElementRef;
  @ViewChild("spacer2") elSpacer2: ElementRef;
  @ViewChild("spacer3") elSpacer3: ElementRef;
  @ViewChild("spacer4") elSpacer4: ElementRef;
  @ViewChild("spacer5") elSpacer5: ElementRef;
  @ViewChild("spacer6") elSpacer6: ElementRef;


  @ViewChild("firstTitle") elFirstTitle: ElementRef;


  @ViewChildren("helpSection") sections: QueryList<ElementRef>;
  lineRadius = 12;
  lineWidth = 8;
  pageRect: any;

  ngOnInit(): void {
    const currentLang = 'it';

    window.scroll(0, 0)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createLineThread();
    }, 1000);
  }

  private replaceHtml(innerHTML: string): void {
    this.htmlContet = this.domSanitizer.bypassSecurityTrustHtml(innerHTML);
  }

  createLineThread() {
    console.log("createThread", this.sections);
    // simple arc M 100,100 L 300,100 A 12,12 0 0 1 312,112 L 312,312
    this.pageRect = this.elPage.nativeElement.getBoundingClientRect();

    let path = "";
    this.sections.forEach((s: ElementRef, index: number) => {
      if (index == 0) {
        const startY = this.y(s) - this.lineRadius + this.lineWidth / 2 - this.pageRect.top;
        const feRect = this.elFirstTitle.nativeElement.getBoundingClientRect();
        const startX = feRect.left + +feRect.width + +this.lineRadius;
        path = "M " + startX.toFixed(0) + "," + startY.toFixed(0) + " ";
      }
      if (index == 3) {
        path += this.createFirstSpacer();
      }
      if (index == 4) {
        path += this.createSecondSpacer(s);
      }
      if (index == 5) {
        path += this.createThirdSpacer(s);
      }
      if (index == 8) {
        path += this.createFourthSpacer(s);
      }
      if (index == 9) {
        path += this.createFifthSpacer(s);
      }
      if (index == 10) {
        path += this.createSixthSpacer(s);
      }

      if (index % 2 == 0) {
        path += this.lineTo(s, "RT");
        path += this.arcTo(s, "RT");
        path += this.lineTo(s, "RB");
        if (index != 2)
          path += this.arcTo(s, "RB");
      }
      else if (index != 3) {
        if (index != 5)
          path += this.lineTo(s, "LT");
        path += this.arcTo(s, "LT");
        path += this.lineTo(s, "LB");
        path += this.arcTo(s, "LB");
      }

    });

    /*
    path += this.lineTo(this.elSection1, "RT");
    path += this.arcTo(this.elSection1, "RT");
    path += this.lineTo(this.elSection1, "RB");
    path += this.arcTo(this.elSection1, "RB");
    path += this.lineTo(this.elSection2, "LT");
    path += this.arcTo(this.elSection2, "LT");
    path += this.lineTo(this.elSection2, "LB");
    path += this.arcTo(this.elSection2, "LB");
    path += this.lineTo(this.elSection3, "RT");
    path += this.arcTo(this.elSection3, "RT");
    */
    let svg = document.getElementById('thread-line');
    svg.setAttribute('width', this.pageRect.width);
    svg.setAttribute('height', this.pageRect.height);
    svg.style['background-color'] = 'transparent';
    var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

    pathElement.style.stroke = "#ddd";
    pathElement.style["stroke-width"] = this.lineWidth;
    pathElement.style["stroke-linecap"] = "round"
    pathElement.setAttribute("d", path)
    pathElement.setAttribute("fill", "none");
    svg.appendChild(pathElement);
  }


  private lineTo(el: ElementRef, corner: string) {
    const b = el.nativeElement.getBoundingClientRect();
    let x: number = b.left;
    let y: number = b.top - this.pageRect.top;
    switch (corner) {
      case "RT":
        x += b.width;
        y -= this.lineRadius - this.lineWidth / 2;
        break;
      case "LT":
        y += this.lineWidth / 2;
        break;
      case "RB":
        x += b.width + this.lineRadius;
        y += b.height;
        break;
      case "LB":
        x -= this.lineRadius;
        y += b.height - this.lineRadius
        break;

      default:
        break;
    }
    return "L " + x.toFixed(0) + "," + y.toFixed(0) + " ";
  }


  private arcTo(el: ElementRef, corner: string): string {
    const b = el.nativeElement.getBoundingClientRect();
    let x: number = b.left;
    let y: number = b.top - this.pageRect.top;
    let v: number = 1
    switch (corner) {
      case "RT":
        x += b.width + this.lineRadius;
        y += this.lineWidth / 2;

        break;
      case "LT":
        y += this.lineRadius + this.lineWidth / 2;
        x -= this.lineRadius;
        v = 0;
        break;
      case "RB":
        x += b.width;
        y += b.height + this.lineRadius;
        break;
      case "LB":
        //x += this.lineRadius;
        y += b.height;
        v = 0;
        break;
      default:
        break;
    }
    return "A " + this.lineRadius + "," + this.lineRadius + " 0 0 " + v + " " + x.toFixed(0) + "," + y.toFixed(0) + " ";
  }

  private x(el: ElementRef): number {
    console.log("ed x", el);
    //return el.nativeElement.offsetLeft;
    return el.nativeElement.getBoundingClientRect().left.toFixed(0);
  }

  private y(el: ElementRef): number {
    console.log("ed y", el);
    return el.nativeElement.getBoundingClientRect().top.toFixed(0);
  }

  private createLine(x: number, y: number): string {
    return "L " + x.toFixed(0) + "," + y.toFixed(0) + " ";
  }

  private createArc(x: number, y: number, v: number = 1): string {
    return "A " + this.lineRadius + "," + this.lineRadius + " 0 0 " + v + " " + x.toFixed(0) + "," + y.toFixed(0) + " ";
  }

  private createFirstSpacer(): string {
    const b = this.elSpacer1.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left + b.width + this.lineRadius;
    const startY = b.top - this.pageRect.top + b.height / 2;
    path += this.createLine(startX, startY);
    const x1 = startX - this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1);
    const x2 = x1 - b.height / 3;
    const y2 = y1;
    path += this.createLine(x2, y2);
    const x3 = x2 - this.lineRadius;
    const y3 = y2 - this.lineRadius;
    path += this.createArc(x3, y3);
    const x4 = x3;
    const y4 = y3 - b.height / 4;
    path += this.createLine(x4, y4);
    const x5 = x4 - this.lineRadius;
    const y5 = y4 - this.lineRadius;
    path += this.createArc(x5, y5, 0);
    const x6 = b.left - b.height;
    const y6 = y5;
    path += this.createLine(x6, y6);
    const x7 = x6 - this.lineRadius;
    const y7 = y6 + this.lineRadius;
    path += this.createArc(x7, y7, 0);
    const x8 = x7;
    const y8 = y7 + b.height / 3;
    path += this.createLine(x8, y8);
    const x9 = x8 + this.lineRadius;
    const y9 = y8 + this.lineRadius;
    path += this.createArc(x9, y9, 0);
    const x10 = b.left - this.lineRadius;
    const y10 = y9;
    path += this.createLine(x10, y10);
    const x11 = x10 + this.lineRadius;
    const y11 = y10 + this.lineRadius;
    path += this.createArc(x11, y11);
    return path;
  }

  private createSecondSpacer(nextElement: ElementRef): string {
    const b = this.elSpacer2.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left;
    const startY = b.top - this.pageRect.top + b.height / 2;
    path += this.createLine(startX, startY);
    const x1 = startX - this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1);
    const x2 = x1 - b.height / 3;
    const y2 = y1;
    path += this.createLine(x2, y2);
    const x3 = x2 - this.lineRadius;
    const y3 = y2 + this.lineRadius;
    path += this.createArc(x3, y3, 0);
    const x4 = x3;
    const y4 = nextElement.nativeElement.getBoundingClientRect().top - this.pageRect.top - 2 * this.lineRadius;
    //const y4 = y3 + b.height / 3;
    path += this.createLine(x4, y4);
    const x5 = x4 + this.lineRadius;
    const y5 = y4 + this.lineRadius;
    path += this.createArc(x5, y5, 0);

    return path;
  }

  private createThirdSpacer(nextElement: ElementRef): string {
    const b = this.elSpacer3.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left + b.width / 6;
    const startY = b.top - this.pageRect.top + this.lineWidth;
    path += this.createLine(startX, startY);
    const x1 = startX - this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1, 0);
    const x2 = x1;
    //const y2 = y1 + b.height / 4;
    const y2 = nextElement.nativeElement.getBoundingClientRect().top - this.pageRect.top - this.lineWidth / 2;
    path += this.createLine(x2, y2);
    const x3 = x2 - this.lineRadius;
    const y3 = y2 + this.lineRadius;
    path += this.createArc(x3, y3);
    const x4 = nextElement.nativeElement.getBoundingClientRect().left + this.lineWidth / 2;
    const y4 = y3;
    path += this.createLine(x4, y4);
    return path;
  }

  private createFourthSpacer(nextElement: ElementRef): string {
    const b = this.elSpacer4.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left + b.width / 6;
    const startY = b.top - this.pageRect.top;
    path += this.createLine(startX, startY);
    const x1 = startX + this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1, 1);
    const x2 = x1;
    //const y2 = y1 + b.height / 4;
    const y2 = nextElement.nativeElement.getBoundingClientRect().top - this.pageRect.top - 2.5 * this.lineWidth;
    path += this.createLine(x2, y2);
    const x3 = x2 + this.lineRadius;
    const y3 = y2 + this.lineRadius;
    path += this.createArc(x3, y3, 0);
    return path;
  }

  private createFifthSpacer(nextElement: ElementRef): string {
    const b = this.elSpacer5.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left + this.lineRadius;
    const startY = b.top - this.pageRect.top;
    path += this.createLine(startX, startY);
    const x1 = startX - this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1, 0);
    return path;
  }

  private createSixthSpacer(nextElement: ElementRef): string {
    const b = this.elSpacer6.nativeElement.getBoundingClientRect();
    let path = "";
    const startX = b.left;
    const startY = b.top - this.pageRect.top + 2.5 * this.lineWidth;
    path += this.createLine(startX, startY);
    const x1 = startX + this.lineRadius;
    const y1 = startY + this.lineRadius;
    path += this.createArc(x1, y1, 0);
    return path;
  }
  public scrollToId(id: string) {
    let element = document.querySelector("#" + id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  public scrollTop() {
    window.scroll(0, 0);
  }

}


