/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { faUserCircle, faChartPie, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faHubspot } from '@fortawesome/free-brands-svg-icons'
import { IntroService } from 'src/app/services/intro.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  title = 'intro';
  //datacatalogHomeUrl = environment.DatacatalogHomeUrl;
  userportalHomeUrl = environment.UserportalHomeUrl;
  widgetHomeUrl = environment.WidgetHomeUrl;
  //userportalAuthUrl = environment.UserportalAuthUrl;
  //userportalAuthTrialUrl = environment.UserportalAuthTrialUrl;
  //datiPiemonteUrl = environment.DatiPiemonteUrl;
  //osservatorioICTUrl = environment.OsservatorioICTUrl;


  faUserCircle = faUserCircle;
  faChartPie = faChartPie;
  faHubspot = faHubspot;
  faAngleRight = faAngleRight;

  projects = ['datipiemonte', 'osservatoriodigitale', 'aaep']

  statsData: any;

  firstDomain;
  secondDomain;
  thirdDomain;
  domainTotalCount: number = 0;
  yesterdayMeasuresCount: number; // Count by milions
  organizationsCount: number;

  constructor(private introService: IntroService) {

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.introService.getStatsData().subscribe((data: any) => {
      this.statsData = data;
      console.log("STATS DATA =>", this.statsData);
      this.setDomainByCount(this.statsData.domains);
      this.yesterdayMeasuresCount = Math.floor(this.statsData.yesterdayMeasures / 10000) / 100;

      var organizationsArr = this.objToArrayOfObj(this.statsData.organizations);
      this.organizationsCount = this.getOrganizationsCount(organizationsArr);
    });
  }

  private setDomainByCount(domains: any) {
    var domains = this.objToArrayOfObj(domains);

    this.removeMultiDomain(domains);

    domains.sort((a, b) => { // Ordering by domain count
      return b.value - a.value;
    })

    console.log("Set Domain by count ", domains);
    this.firstDomain = domains[0]; // The first one after the ordering => firstDomain by count
    this.secondDomain = domains[1];
    this.thirdDomain = domains[2];

    domains.forEach(domain => {
      this.domainTotalCount += domain.value;
    });
  }

  private getOrganizationsCount(organizations: []): number {
    for (var i: number = 0; i < organizations.length; i++) {
      if ((<string>(organizations[i]['key'])).includes("personal")) {
        organizations.splice(i, 1);
        break;
      }
    }
    return organizations.length;
  }

  private removeMultiDomain(domains: []) {
    for (var i: number = 0; i < domains.length; i++) {
      if (domains[i]['key'] == "MULTI") {
        domains.splice(i, 1);
        break;
      }
    }
  }

  private objToArrayOfObj(obj: any): any {
    var result: any[] = [];
    var objKeys: string[] = Object.keys(obj);
    objKeys.forEach((objKey: string) => {
      var d = {
        key: objKey,
        value: obj[objKey]
      }
      result.push(d);
    })
    console.log("objToArrayOfObj DEBUG =>", result);
    return result;
  }
}
