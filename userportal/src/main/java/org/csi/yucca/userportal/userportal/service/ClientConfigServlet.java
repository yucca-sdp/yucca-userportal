/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import org.csi.yucca.userportal.userportal.info.ApiEntityEnum;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/config" }, initParams = { @WebInitParam(name = "responseType", value = "angularJs"), }, asyncSupported = true)
public class ClientConfigServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(ClientConfigServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[ClientConfigServlet::doGet] - START");
		try {
			response.setContentType("text/javascript");
			PrintWriter out = response.getWriter();

			String responseType = request.getParameter("responseType");
			if (responseType == null)
				responseType = getServletConfig().getInitParameter("responseType");
			log.debug("[ClientConfigServlet::doGet] - responseType: " + responseType);

			Properties config = Config.loadClientConfiguration();
			// 
			String responseString = formatConfig(config, responseType);
			out.println(responseString);

			Properties constants = new Properties();
						
			for (ApiEntityEnum apiEntity : ApiEntityEnum.values()) {
				apiEntity.addPropertyForJs(request.getContextPath(), constants);	
			}
			
			constants.put("RBAC_BASE_PERMISSION_PATH", AuthorizeUtils.RBAC_BASE_PERMISSION_PATH);
			
			
			String constantsString = formatConstants(constants, responseType);
			
			out.println(constantsString);
			out.close();
		} catch (IOException e) {
			log.error("[ClientConfigServlet::doGet] - ERROR " + e.getMessage());
			throw e;
		} finally {
			log.debug("[ClientConfigServlet::doGet] - END");
		}
	}

	private String formatConstants(Properties constants, String responseType) {
		log.debug("[ClientConfigServlet::formatConstants] - START");
		try {
			StringBuffer sb = new StringBuffer("");
			if ("angularJs".equals(responseType)) {
				sb.append("var Constants = Constants || {};\n\n");
				for (String key : constants.stringPropertyNames()) {
					sb.append("Constants." + key + "='" + constants.getProperty(key) + "';\n");
				}
			}
			else{
				sb.append("\n\n*** WARNING: response type:'" + responseType +"' is actually NOT Supported ***\n\n");
				for (String key : constants.stringPropertyNames()) {
					sb.append("" + key + "='" + constants.getProperty(key) + "';\n");
				}

			}

			return sb.toString();

		} finally {
			log.debug("[ClientConfigServlet::formatConstants] - END");
		}
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[ClientConfigServlet::doPost] - START");
		try {
			doGet(request, response);
		} finally {
			log.debug("[ClientConfigServlet::doPost] - END");
		}
	}

	private String formatConfig(Properties config, String responseType) {
		log.debug("[ClientConfigServlet::formatConfig] - START");
		try {
			StringBuffer sb = new StringBuffer("");
			if ("angularJs".equals(responseType)) {
				sb.append("'use strict';\n\n");
				sb.append("var appConfig = angular.module('userportal.config', []);\n\n");
				for (String key : config.stringPropertyNames()) {
					sb.append("appConfig.constant('" + key + "', '" + config.getProperty(key) + "');\n");
				}
			}
			else{
				sb.append("\n\n*** WARNING: response type:'" + responseType +"' is actually NOT Supported ***\n\n");
				for (String key : config.stringPropertyNames()) {
					sb.append("" + key + "=" + config.getProperty(key) + ";\n");
				}

			}

			return sb.toString();

		} finally {
			log.debug("[ClientConfigServlet::formatConfig] - END");
		}
	}

}
