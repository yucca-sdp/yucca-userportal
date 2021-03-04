/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class Config {
	static Logger log = Logger.getLogger(Config.class);
	
	// YuccaTenantRequest properties
	public static final String BACKOFFICE_EMAIL = "BACKOFFICE_EMAIL";
	public static final String FROM_EMAIL = "FROM_EMAIL";
	public static final String HOST_EMAIL = "HOST_EMAIL";
	public static final String SITESECRET_RECAPTCHA = "SITESECRET_RECAPTCHA";
	
	public static Properties loadIntroConfiguration() throws IOException {
		return loadConfiguration("intro.properties");
	}
	
	private static Properties loadConfiguration(String configPath) throws IOException {
		log.debug("[Config::loadConfiguration] - START, configPath " + configPath);
		try {			
			Properties config = new Properties();
			config.load(Config.class.getClassLoader().getResourceAsStream(configPath));
			return config;
		} finally {
			log.debug("[Config::loadConfiguration] - END, configPath " + configPath);
		}
	}

}
