/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWorkAreaComponent } from './request-work-area.component';

describe('RequestWorkAreaComponent', () => {
  let component: RequestWorkAreaComponent;
  let fixture: ComponentFixture<RequestWorkAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWorkAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWorkAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
