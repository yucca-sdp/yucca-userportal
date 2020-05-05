/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.utils;

import java.util.Random;
import javax.servlet.ServletConfig;

public class SamlUtil {
	/**
	 * Generates a unique Id for Authentication Requests
	 * 
	 * @return generated unique ID
	 */
	public static String createID() {

		byte[] bytes = new byte[20]; // 160 bit

		new Random().nextBytes(bytes);

		char[] charMapping = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p' };

		char[] chars = new char[40];

		for (int i = 0; i < bytes.length; i++) {
			int left = (bytes[i] >> 4) & 0x0f;
			int right = bytes[i] & 0x0f;
			chars[i * 2] = charMapping[left];
			chars[i * 2 + 1] = charMapping[right];
		}

		return String.valueOf(chars);
	}

	/**
	 * reads configurations from web.xml
	 * 
	 * @param servletConfig
	 * @param configuration
	 * @return
	 */
	public static String getConfiguration(ServletConfig servletConfig, String configuration) {
		return servletConfig.getInitParameter(configuration);

	}
}
