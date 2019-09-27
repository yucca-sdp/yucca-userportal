/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.statistics;

import java.util.List;

public class D {
	private int __count;
	private List<StatisticsRow> results;
	public D() {
		super();
	}

	public int get__count() {
		return __count;
	}

	public void set__count(int __count) {
		this.__count = __count;
	}

	public List<StatisticsRow> getResults() {
		return results;
	}

	public void setResults(List<StatisticsRow> results) {
		this.results = results;
	}
}
