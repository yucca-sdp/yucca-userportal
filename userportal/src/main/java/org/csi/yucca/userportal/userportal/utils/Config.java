/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class Config {
	static Logger log = Logger.getLogger(Config.class);

	public static final String API_SERVICES_URL_KEY = "API_SERVICES_URL";
	public static final String API_MANAGEMENT_URL_KEY = "API_MANAGEMENT_URL";
	public static final String API_ODATA_URL_KEY = "API_ODATA_URL";
	public static final String API_ODATARUPAR_URL_KEY = "API_ODATARUPAR_URL";
	public static final String API_STORE_URL_KEY = "API_STORE_URL";
	public static final String API_METADATA_URL_KEY = "API_METADATA_URL";
	public static final String API_ADMIN_URL_KEY = "API_ADMIN_URL";
	

	public static final String RBAC_PERMISSIONS_WEBSERVICE_URL_KEY = "RBAC_PERMISSIONS_WEBSERVICE_URL";
	public static final String RBAC_ROLES_WEBSERVICE_URL_KEY = "RBAC_ROLES_WEBSERVICE_URL";
	public static final String RBAC_USER_STORE_WEBSERVICE_URL_KEY = "RBAC_USER_STORE_WEBSERVICE_URL";
	public static final String RBAC_WEBSERVICE_USER_KEY = "RBAC_WEBSERVICE_USER";
	public static final String RBAC_WEBSERVICE_PASSWORD_KEY = "rbac.webservice.secret";
	
	
	public static final String TOKEN_FROM_SAML_URL_KEY = "TOKEN_FROM_SAML_URL";
	public static final String TOKEN_FROM_SAML_USER_KEY = "TOKEN_FROM_SAML_USER";
	public static final String TOKEN_FROM_SAML_PASSWORD_KEY = "token.from.saml.secret";
	public static final String JWT_FROM_VALIDATION_TOKEN_URL_KEY = "JWT_FROM_VALIDATION_TOKEN_URL";
	public static final String JWT_FROM_VALIDATION_TOKEN_USER_KEY = "JWT_FROM_VALIDATION_TOKEN_USER";
	public static final String JWT_FROM_VALIDATION_TOKEN_PASSWORD_KEY = "jwt.from.validation.token.secret";
	
	public static final String TWITTER_POLLER_URL_KEY="TWITTER_POLLER_URL";

	public static final String TWITTER_CONSUMER_KEY = "TWITTER_CONSUMER";
	public static final String TWITTER_CONSUMER_SECRET_KEY  = "TWITTER_CONSUMER_SECRET";
	
	public static final String HTTP_PROXY_HOST_KEY = "HTTP_PROXY_HOST";
	public static final String HTTP_PROXY_PORT_KEY  = "HTTP_PROXY_PORT";
	
	public static final String TAG_DOMAINS_URL_KEY = "TAG_DOMAINS_URL";
	
	public static final String API_PROXY_SERVICES_BASE_URL = "/api/proxy/services/";
	public static final String API_PROXY_SERVICES_TWITTER_BASE_URL = "/api/proxy/twitter/";
	public static final String API_PROXY_MANAGEMENT_BASE_URL = "/api/proxy/management/";
	public static final String API_PROXY_DATA_STATISTICS_URL = "/api/proxy/management/statistics/";
	public static final String API_PROXY_DISCOVERY_BASE_URL = "/api/proxy/discovery/";
	public static final String API_PROXY_ODATA_BASE_URL = "/api/proxy/odata/";
	public static final String API_PROXY_STORE_BASE_URL = "/api/proxy/store/";
	public static final String API_PROXY_METADATA_BASE_URL = "/api/proxy/metadata/";
	public static final String API_PROXY_RESOURCES_BASE_URL = "/api/proxy/resources/";
	public static final String API_PROXY_ADMIN_BASE_URL = "/api/proxy/admin/";
	public static final String SECDATA_NEWTOKEN = "/secdata/newtoken/";
	
	public static final String STATISTICS_DATASET_CODE = "STATISTICS_DATASET_CODE";
	public static final String STATISTICS_AUTH_TOKEN = "STATISTICS_AUTH_TOKEN";
	
	public static final String YUCCA_HOME_PAGE = "YUCCA_HOME_PAGE";
	

	
	public static Properties loadClientConfiguration() throws IOException {
		return loadConfiguration("client.properties");
	}

	public static Properties loadServerConfiguration() throws IOException {
		return loadConfiguration("server.properties");
	}
	
	public static Properties loadAuthorizationConfiguration() throws IOException {
		return loadConfiguration("authorization.properties");
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
