/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'intro-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.sass']
})
export class ProjectCardComponent implements OnInit {

  @Input() project: any
  constructor() { }

  ngOnInit(): void {
  }

}
