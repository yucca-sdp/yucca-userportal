/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/app.constants';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {

  projects = ['datipiemonte', 'osservatoriodigitale','aaep','rifiutiinpiemonte', 'wifipubblico', 'incidentalita', 'bigiot', 'statistica', 'wanda', 'the4bees', 'symon', 'memora', 'cruscottoirap', 'onde', 'quadrante', 'quies', 'seesaw', 'sorriso', 'librare', 'limpid', 'esgp', 'leo', 'ppsafa', 'citypayid', 'ipowit', 'haladinschool', 'healthcommons', 'smartowear', 'all4all']

  faArrowLeft = faArrowLeft;
  projectKeys: Array<string>;

  constructor() {
    this.projectKeys = Object.keys(Constants.PROJECTS);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    console.log('projects', this.projectKeys);
  }

}
