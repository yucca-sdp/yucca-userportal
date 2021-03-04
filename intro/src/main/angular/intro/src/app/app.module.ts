/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { RequestWorkAreaComponent } from './pages/yucca/request-work-area/request-work-area.component';
import { HomeComponent } from './pages/common/home/home.component';
import { CitizenComponent } from './pages/yucca/request-work-area/citizen/citizen.component';
import { CompanyComponent } from './pages/yucca/request-work-area/company/company.component';
import { PaComponent } from './pages/yucca/request-work-area/pa/pa.component';
import { RequestFormComponent } from './pages/yucca/request-work-area/request-form/request-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ProjectsComponent } from './pages/common/projects/projects.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectComponent } from './pages/common/project/project.component';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { FooterComponent } from './components/footer/footer.component';
import { DatacatIntroComponent } from './pages/datacat/datacat-intro/datacat-intro.component';
import { WhatisDatacatalogComponent } from './pages/datacat/whatis-datacatalog/whatis-datacatalog.component';

import { PathLocationStrategy, LocationStrategy } from '@angular/common';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'request-work-area', component: RequestWorkAreaComponent },
  { path: 'request-work-area/request-form/:entity', component: RequestFormComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:project', component: ProjectComponent },
  { path: 'datacat', component: DatacatIntroComponent },
  { path: 'datacat/whatis', component: WhatisDatacatalogComponent },
  { path: '**', redirectTo: '', component: HomeComponent },
];

registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    RequestWorkAreaComponent,
    HomeComponent,
    CitizenComponent,
    CompanyComponent,
    PaComponent,
    RequestFormComponent,
    ProjectsComponent,
    ProjectCardComponent,
    ProjectComponent,
    FooterComponent,
    DatacatIntroComponent,
    WhatisDatacatalogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,

    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
