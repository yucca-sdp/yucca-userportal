/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.backoffice.service.proxy.admin.v01;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;

import org.csi.yucca.userportal.backoffice.service.ApiProxyServlet;
import org.csi.yucca.userportal.backoffice.utils.Config;

@WebServlet(description = "Api proxy Servlet  for admin manangement", urlPatterns = { "/api/proxy/admin/1/backoffice/*" }, asyncSupported = false)
public class ApiAdminBackofficeProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_ADMIN_URL_KEY)+"/1/backoffice";
		} catch (IOException e) {
			log.error("[ApiAdminBackofficeProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}
	
/*
	@Override
	protected void setOauthTokenInHeader(HttpServletRequest request, GetMethod getMethod) {
		Info info  = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		if(info!=null && info.getUser()!=null && info.getUser().getSecretTempJwtRaw()!=null){
			getMethod.setRequestHeader("x-auth-token", info.getUser().getSecretTempJwtRaw());
		}
	}

	@Override
	protected void beforeExecute(HttpServletRequest request, GetMethod method) {
	}

	@Override
	protected void beforeExecute(HttpServletRequest request, PostMethod method) throws ServletException {
	}*/

}
