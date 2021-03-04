/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component } from '@angular/core';
import { faUserCircle, faChartPie, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import { faHubspot } from '@fortawesome/free-brands-svg-icons'
import { IntroService } from './services/intro.service';
import { User } from './model/user';
import { userportalInfo } from './model/userportalInfo';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'intro';

  faUserCircle = faUserCircle;
  faChartPie = faChartPie;
  faHubspot = faHubspot;
  faAngleRight = faAngleRight;
  currentUser: User;

  //datacatUrl = environment.DatacatalogHomeUrl;

  currentRoute: string;

  constructor(private introService: IntroService, public translate: TranslateService, public router: Router) {
    translate.addLangs(['it']);
    //if (localStorage.getItem('locale')) {
    //  const browserLang = localStorage.getItem('locale');
    //  translate.use(browserLang.match(/it|en/) ? browserLang : 'it');
    //} else {
    //  localStorage.setItem('locale', 'it');
    //  translate.setDefaultLang('it');
    //}

    translate.setDefaultLang('it');

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = e.url;
        console.log("currentRoute =>", this.currentRoute);
      }
    });

  }

  ngOnInit() {
    this.introService.getCurrentUserYucca().subscribe((data: userportalInfo) => {
      console.log(data);
      if (data && data.user && data.user.loggedIn) {
        this.currentUser = data.user;
      } else {
        console.log("datacat");

        this.introService.getCurrentUserDatacat().subscribe((data: User) => {
          console.log(data);
          this.currentUser = data;
        },
          (err) => { console.log(err) })
      }
    })
  }
}
