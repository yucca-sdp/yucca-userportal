/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.backoffice.utils;

public class Util {
	public static String nvl(Object o) {
		return o == null ? "" : o.toString();
	}

	public static String nvlt(Object o) {
		return nvl(o).trim();
	}
}
