/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-citizen',
  templateUrl: './citizen.component.html',
  styleUrls: [
    './citizen.component.sass',
    './../../../../app.component.sass'
  ]
})
export class CitizenComponent implements OnInit {

  constructor() {
  }

  faUserCircle = faUserCircle;
  urlLoginYuccaCitizen = environment.UrlLoginYuccaCitizen;

  ngOnInit(): void {
  }

}
