/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { userportalInfo } from '../model/userportalInfo';

@Injectable({
  providedIn: 'root'
})
export class IntroService {

  constructor(private httpClient: HttpClient) { }

  public getCurrentUserYucca() {
    return this.httpClient.get<userportalInfo>(environment.YUCCA_API_URL + '/info');
  }

  public getCurrentUserDatacat() {
    return this.httpClient.get<User>(environment.DATACAT_API_URL + '/session/currentUser');
  }

  public postRequestForm(form, token) {
    return this.httpClient.post<any>(environment.IntroWebAppUrl + "/service/yucca/tenantrequest", { recaptcha: token, data: form });
  }

  public getStatsData() {
    return this.httpClient.get<any>(environment.IntroWebAppUrl + "stats");
  }
}
