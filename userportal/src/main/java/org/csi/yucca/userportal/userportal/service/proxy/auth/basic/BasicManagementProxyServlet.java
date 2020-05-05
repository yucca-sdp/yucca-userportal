/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.proxy.auth.basic;

import org.csi.yucca.userportal.userportal.utils.Config;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;

@WebServlet(description = "Api proxy Servlet  for service with basic authentication", urlPatterns = {  "/secure/proxy/management/*" }, asyncSupported = true)
public class BasicManagementProxyServlet extends BasicAuthProxyServlet{
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_MANAGEMENT_URL_KEY);
		} catch (IOException e) {
			log.error("[BasicManagementProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

}
