/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-work-area',
  templateUrl: './request-work-area.component.html',
  styleUrls: ['./../../../app.component.sass']
})
export class RequestWorkAreaComponent {

  selectedTab: string = "citizen";

  constructor() { }

  public setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

}
