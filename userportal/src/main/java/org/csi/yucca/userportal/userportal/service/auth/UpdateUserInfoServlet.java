/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.auth;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/updateUserInfo" }, asyncSupported = true)
public class UpdateUserInfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(UpdateUserInfoServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[UpdateUserInfoServlet::doGet] - START");
		try {
			String storeToken = request.getParameter("storeToken");
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);

			info.getUser().setStoreToken(storeToken);
			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);

			String infoJson = info.toJson();
			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(infoJson);
			out.close();
		} catch (Exception e) {
			log.error("[UpdateUserInfoServlet::doGet] - ERROR " + e.getMessage());
			throw new ServletException(e.getMessage());
		} finally {
			log.debug("[UpdateUserInfoServlet::doGet] - END");
		}
	}

	

}
