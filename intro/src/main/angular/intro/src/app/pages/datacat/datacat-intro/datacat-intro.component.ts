/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-datacat-intro',
  templateUrl: './datacat-intro.component.html',
  styleUrls: ['./datacat-intro.component.sass']
})
export class DatacatIntroComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  datacatUrl = environment.DatacatalogHomeRuparUrl;
  spidLoginUrl = environment.DatacatalogHomeSpidUrl;

  section: string = 'datacat';

  constructor() { }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

}
