/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/odata/*" }, asyncSupported = false)
public class ApiODataProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			log.info("[ApiServiceProxyServlet::setApiBaseUrl : apiContext]"+this.apiContext );
			if(this.apiContext != null) {
				if (this.apiContext.equals("odata"))
					apiBaseUrl = config.getProperty(Config.API_ODATA_URL_KEY);
				else if (this.apiContext.equals("odatarupar")) {
					log.info("[ApiServiceProxyServlet::setApiBaseUrl : in if]"+this.apiContext );
					apiBaseUrl = config.getProperty(Config.API_ODATARUPAR_URL_KEY);
				}
			}
			else 
				apiBaseUrl = config.getProperty(Config.API_ODATA_URL_KEY);
			log.info("[ApiServiceProxyServlet::setApiBaseUrl : url]"+this.apiBaseUrl );
		} catch (IOException e) {
			log.error("[ApiServiceProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	protected void setOauthTokenInHeader(HttpServletRequest request, HttpMethod method) {
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		if (info != null && info.getUser() != null && info.getUser().getToken() != null) {
			method.setRequestHeader("Authorization", "Bearer " + info.getUser().getToken());
		}

	}

	@Override
	protected void beforeExecute(HttpServletRequest request, GetMethod method) {
		//apiContext =  request.getParameter("apiContext");
		//log.info("[createTargetUrlWithParameters::beforeExecute : apiContext]"+apiContext );
		//this.setApiBaseUrl();
	}

	@Override
	protected void beforeExecute(HttpServletRequest request, PostMethod method) throws ServletException {
		
	}

}
