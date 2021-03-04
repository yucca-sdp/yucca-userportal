/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { faFacebook, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {

  faFacebook = faFacebook;
  faTwitterSquare = faTwitterSquare;
  faArrowLeft = faArrowLeft;
  constructor(private route: ActivatedRoute) { }

  project: any
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      console.log("project", params['project']);
      this.project = Constants.PROJECTS[params['project']];
      console.log("project", this.project);
    });

  }
}
