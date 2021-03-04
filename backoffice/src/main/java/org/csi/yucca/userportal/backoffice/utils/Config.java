/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.backoffice.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class Config {
	static Logger log = Logger.getLogger(Config.class);

	public static final String API_SERVICES_URL_KEY = "API_SERVICES_URL";
	public static final String API_MANAGEMENT_URL_KEY = "API_MANAGEMENT_URL";
	//public static final String API_DISCOVERY_URL_KEY = "API_DISCOVERY_URL";
	//apublic static final String API_ODATA_URL_KEY = "API_ODATA_URL";
	public static final String API_FABRIC_URL_KEY = "API_FABRIC_URL";
	public static final String API_DEPLOY_ACTION_URL_KEY = "API_DEPLOY_ACTION_URL";

	public static final String OOZIE_PROMOTION_XML_METASTORE_KEY = "OOZIE_PROMOTION_XML_METASTORE";
	public static final String OOZIE_PROMOTION_ZOOKEPER_QUORUM_KEY = "OOZIE_PROMOTION_ZOOKEPER_QUORUM";
	public static final String OOZIE_PROMOTION_LIBPATH_KEY = "OOZIE_PROMOTION_LIBPATH";
	public static final String OOZIE_PROMOTION_USER_KEY = "OOZIE_PROMOTION_USER";
	public static final String OOZIE_PROMOTION_HBASE_PRINCIPAL_KEY = "OOZIE_PROMOTION_HBASE_PRINCIPAL";
	public static final String OOZIE_PROMOTION_MAPREDUCE_USER_KEY = "OOZIE_PROMOTION_MAPREDUCE_USER";
	public static final String OOZIE_PRMOTION_MASTER_KEY = "OOZIE_PRMOTION_MASTER";
	public static final String OOZIE_PROMOTION_WF_OO_PATH_KEY = "OOZIE_PROMOTION_WF_OO_PATH";
	public static final String OOZIE_PROMOTION_HIVE_PRINCIPAL_KEY = "OOZIE_PRMOTION_HIVE_PRINCIPAL";
	public static final String OOZIE_PROMOTION_QUEUE_NAME_KEY = "OOZIE_PROMOTION_QUEUE_NAME";
	public static final String OOZIE_PROMOTION_WF_PATH_KEY = "OOZIE_PROMOTION_WF_PATH";
	public static final String OOZIE_PROMOTION_JDBC_URL_KEY = "OOZIE_PROMOTION_JDBC_URL";
	public static final String OOZIE_PROMOTION_JOB_TRACKER_KEY = "OOZIE_PROMOTION_JOB_TRACKER";
	public static final String OOZIEPROMOTION_NAME_NODE_KEY = "OOZIEPROMOTION_NAME_NODE";
	public static final String OOZIE_PROMOTION_WF_APPLICATION_PATH_KEY = "OOZIE_PROMOTION_WF_APPLICATION_PATH";


	public static final String RBAC_PERMISSIONS_WEBSERVICE_URL_KEY = "RBAC_PERMISSIONS_WEBSERVICE_URL";
	public static final String RBAC_ROLES_WEBSERVICE_URL_KEY = "RBAC_ROLES_WEBSERVICE_URL";
	public static final String RBAC_WEBSERVICE_USER_KEY = "RBAC_WEBSERVICE_USER";
	public static final String RBAC_WEBSERVICE_PASSWORD_KEY = "rbac.webservice.secret";
	//20171023 - Aggiunta nuova chiave per nuove API
	public static final String API_ADMIN_URL_KEY = "API_ADMIN_URL";

	
//	public static final String API_PROXY_SERVICES_BASE_URL = "/api/proxy/services/";
//	public static final String API_PROXY_MANAGEMENT_BASE_URL = "/api/proxy/management/";
//	public static final String API_PROXY_DATA_STATISTICS_URL = "/api/proxy/management/statistics/";
	public static final String API_PROXY_FABRIC_BASE_URL = "/api/proxy/fabric/";
	public static final String API_PROXY_DEPLOY_BASE_URL = "/api/proxy/deploy/";
	public static final String  SECDATA_NEWTOKEN = "/secdata/newtoken/";
	//20171023 - Aggiunto nuovo proxy
	public static final String API_PROXY_ADMIN_BASE_URL = "/api/proxy/admin/";
	
	
	

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
