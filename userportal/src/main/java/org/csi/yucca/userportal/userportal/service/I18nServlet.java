/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/i18n" }, initParams = { @WebInitParam(name = "language", value = "it"), }, asyncSupported = true)
public class I18nServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(I18nServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[I18nServlet::doGet] - START");
		try {

			String language = request.getParameter("language");
			ResourceBundle messages;
			if(language==null){
				language = getServletConfig().getInitParameter("language");
			}

			log.debug("[I18nServlet::doGet] - language: " + language);
			
			Locale currentLocale = new Locale(language);
			messages = ResourceBundle.getBundle("/org/csi/yucca/userportal/userportal/i18n/MessagesBundle",currentLocale);



			String responseString = formatMessages(messages, currentLocale);

			response.setContentType("text/javascript");
			PrintWriter out = response.getWriter();

			out.println(responseString);
			out.close();
		} catch (IOException e) {
			log.error("[I18nServlet::doGet] - ERROR " + e.getMessage());
			throw e;
		} finally {
			log.debug("[I18nServlet::doGet] - END");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[I18nServlet::doPost] - START");
		try {
			doGet(request, response);
		} finally {
			log.debug("[I18nServlet::doPost] - END");
		}
	}

	private String formatMessages(ResourceBundle messages, Locale locale) {
		log.debug("[I18nServlet::formatMessages] - START");
		try {
			StringBuffer sb = new StringBuffer("");
			sb.append("var translations_" + locale.getLanguage() +  " = {\n\n");

			for (String key : messages.keySet()) {
				sb.append(key + ": '" + messages.getString(key) + "',\n");
			}

			sb.append("};\n");
			return sb.toString();

		} finally {
			log.debug("[I18nServlet::formatMessages] - END");
		}
	}
}
