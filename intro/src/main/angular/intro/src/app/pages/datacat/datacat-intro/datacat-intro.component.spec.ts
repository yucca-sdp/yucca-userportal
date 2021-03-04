/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacatIntroComponent } from './datacat-intro.component';

describe('DatacatIntroComponent', () => {
  let component: DatacatIntroComponent;
  let fixture: ComponentFixture<DatacatIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatacatIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacatIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
