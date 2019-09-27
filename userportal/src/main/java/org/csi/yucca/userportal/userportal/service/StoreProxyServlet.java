/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.URIException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.http.client.utils.URLEncodedUtils;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/store/*" }, asyncSupported = false)
public class StoreProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_STORE_URL_KEY);
		} catch (IOException e) {
			log.error("[StoreProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	protected void setOauthTokenInHeader(HttpServletRequest request, HttpMethod method) {

	}

	@Override
	protected void beforeExecute(HttpServletRequest request, GetMethod get) {
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		String username = info.getUser().getUsername();

		List<NameValuePair> params = new LinkedList<NameValuePair>();
		try {
			List<org.apache.http.NameValuePair> existingParams = URLEncodedUtils.parse(new URI(get.getURI().toString()), "UTF-8");
			if (existingParams != null)
				for (org.apache.http.NameValuePair existingParam : existingParams) {
					if (!existingParam.getName().equals("username"))
						params.add(new NameValuePair(existingParam.getName(), existingParam.getValue()));
				}
		} catch (URISyntaxException e) {
			log.error("[StoreProxyServlet::beforeExecute] - query string: " + get.getQueryString() + " - ERROR " + e.getMessage());
			e.printStackTrace();
		} catch (URIException e) {
			log.error("[StoreProxyServlet::beforeExecute] - query string: " + get.getQueryString() + " - ERROR " + e.getMessage());
			e.printStackTrace();
		}

		params.add(new NameValuePair("username", username));
		get.setQueryString(params.toArray(new NameValuePair[params.size()]));
		// get.setQueryString(get.getQueryString() + "&username=" + username);
	}

	@Override
	protected void beforeExecute(HttpServletRequest request, PostMethod post) throws ServletException {
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);

		String username = info.getUser().getUsername();
		if (post.getParameter("username") != null)
			post.setParameter("username", username);
		else
			post.addParameter("username", username);
			
		/*for (NameValuePair p: post.getParameters()) {
			if(p.getValue()!=null && (p.getValue().toLowerCase().contains("iframe")||p.getValue().toLowerCase().contains("script")))
				throw new ServletException("Invalid parameter value");
		}*/
	}

}
