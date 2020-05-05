/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.backoffice.service;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.backoffice.info.Info;
import org.csi.yucca.userportal.backoffice.utils.AuthorizeUtils;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/info" }, asyncSupported = true)
public class InfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(InfoServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[InfoServlet::doGet] - START");
		try {
			//String info =  "{\"info\":{\"tenant\": {\"tenantCode\":\"" + request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE) + "\"}}}";
			Info info  = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			
			String infoJson = info.toJson();
			if (isJSONPRequest(request))
				infoJson = getCallbackMethod(request) + "(" +infoJson + ")";


			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(infoJson);
			out.close();
		} catch (IOException e) {
			log.error("[InfoServlet::doGet] - ERROR " + e.getMessage());
			throw e;
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
