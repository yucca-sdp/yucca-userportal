/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  UserportalInfoUrl = environment.UserportalInfoUrl;
  SmartdatanetEmail = environment.SmartdatanetEmail;
  PrivacyInfoUrl = environment.PrivacyInfoUrl;
  CookiePolicyUrl = environment.CookiePolicyUrl;
  RegionePiemonteUrl = environment.RegionePiemonteUrl;
  CsiPiemonteUrl = environment.CsiPiemonteUrl;

  constructor() { }

  ngOnInit(): void {
  }

}
