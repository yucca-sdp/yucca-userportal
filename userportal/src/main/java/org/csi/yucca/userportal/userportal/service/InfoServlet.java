/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.admin.tenant.Tenant;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/info" }, asyncSupported = true)
public class InfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(InfoServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[InfoServlet::doGet] - START");
		try {
			// String info = "{\"info\":{\"tenant\": {\"tenantCode\":\"" +
			// request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE)
			// + "\"}}}";
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			if (info != null && info.getUser() != null && info.getUser().getTenants() != null) {
				if (info.getUser().hasTenant(request.getParameter("activeTenant"))) {
					info.getUser().setActiveTenant(request.getParameter("activeTenant"));
					String token = SAML2ConsumerServlet.getTokenForTenant(info.getUser().getActiveTenant(), info.getUser());
					info.getUser().setToken(token);
				}

				if (request.getParameter("refreshRequestedTenant") != null && request.getParameter("refreshRequestedTenant").equalsIgnoreCase("true")) {
					List<Tenant> allTenant = SAML2ConsumerServlet.getAllTenants(info);
					info.setPersonalTenantToActivated(SAML2ConsumerServlet.filterPersonalTenant(allTenant, info.getUser().getUsername()));
					info.setTrialTenantToActivated(SAML2ConsumerServlet.filterTrialTenant(allTenant, info.getUser().getUsername()));
				}
			}
			String infoJson = info.toJson();
			if (isJSONPRequest(request))
				infoJson = getCallbackMethod(request) + "(" + infoJson + ")";

			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(infoJson);
			out.close();
		} catch (Exception e) {
			log.error("[InfoServlet::doGet] - ERROR " + e.getMessage());
			throw new ServletException(e.getMessage(), e.getCause());
		} finally {
			log.debug("[InfoServlet::doGet] - END");
		}
	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

}
