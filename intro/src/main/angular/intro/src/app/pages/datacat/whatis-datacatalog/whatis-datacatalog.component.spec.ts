/**
 * SPDX-License-Identifier: EUPL-1.2
 * (C) Copyright 2019 - 2021 Regione Piemonte
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatisDatacatalogComponent } from './whatis-datacatalog.component';

describe('WhatisDatacatalogComponent', () => {
  let component: WhatisDatacatalogComponent;
  let fixture: ComponentFixture<WhatisDatacatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatisDatacatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatisDatacatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
