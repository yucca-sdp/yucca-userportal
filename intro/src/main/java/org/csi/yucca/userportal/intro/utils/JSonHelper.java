/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.utils;

import com.google.gson.Gson;

public class JSonHelper {
	private static Gson gson;

	public static Gson getInstance() {
		if (gson == null)
			gson = new Gson(); //.setExclusionStrategies(new GSONExclusionStrategy()).disableHtmlEscaping().setPrettyPrinting().create();
		return gson;
	}

}
