/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.utils;

public class Util {
	public static String nvl(Object o) {
		return o == null ? "" : o.toString();
	}

	public static String nvlt(Object o) {
		return nvl(o).trim();
	}
}
