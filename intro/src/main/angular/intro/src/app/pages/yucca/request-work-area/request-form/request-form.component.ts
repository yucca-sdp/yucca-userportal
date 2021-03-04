/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IntroService } from 'src/app/services/intro.service';


@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: [
    './request-form.component.sass',
    './../../../../app.component.sass'
  ]
})
export class RequestFormComponent implements OnInit {
  name = new FormControl('');

  siteKey = '6LcsrXYUAAAAANTisQR2vQMvmOTk49OlNRQcZuQ-';

  entity: string;
  requestForm: FormGroup;

  alertError: string;
  alertSuccess: string;

  loading: boolean = false;

  captchaToken: string;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private introService: IntroService) {
    this.requestForm = formBuilder.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      role: ["", Validators.required],
      email: ["", Validators.required],
      telephone: ["", Validators.required],
      denomination: ["", Validators.required],
      reason: ["", Validators.required]
    })
  };

  ngOnInit(): void {
    this.entity = this.route.snapshot.params['entity'];
  }

  onSubmit(): void {
    this.alertSuccess = null;
    this.alertError = null;

    this.loading = true;
    console.log("submit request form!", this.requestForm.value);
    this.introService.postRequestForm(this.requestForm.value, this.captchaToken).subscribe((response: any) => {
      console.log("FORM REQUEST RESPONSE", response);
      this.alertSuccess = "Richiesta inviata correttamente. Un riepilogo è stato inviato alla casella di posta indicata";
      this.loading = false;
      this.alertError = null;
    }, (err) => {
      console.log("SubmitForm error: ", err);
      this.alertError = "Richiesta fallita. Riprovare" + err.message;
      this.loading = false;
      this.alertSuccess = null;
    });
  }

  resolved(captchaResponse: string, res) {
    console.log(`Resolved response token: ${captchaResponse}`);
    this.captchaToken = captchaResponse;
  }

}
