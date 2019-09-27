/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.Releasenotes;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/releasenotes" }, asyncSupported = true)
public class ReleasenotesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(ReleasenotesServlet.class);

	private static final String[] availableReleasenotes = new String[] { "2.1.0", "2.1.1" };

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[InfoServlet::doGet] - START");
		try {

			String releasenotesJson = null;
			if (request.getParameter("availablelist") != null) {
				Gson gson = JSonHelper.getInstance();
				releasenotesJson = gson.toJson(availableReleasenotes);
			} else {
				releasenotesJson = loadReleasenotes(request.getParameter("lang"), request.getParameter("v"));
			}

			if (isJSONPRequest(request))
				releasenotesJson = getCallbackMethod(request) + "(" + releasenotesJson + ")";

			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(releasenotesJson);
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

	private String loadReleasenotes(String lang, String version) throws IOException {
		if (lang == null)
			lang = "it";
		if (version == null)
			version = new Info().getVersion();

		String releasenotesPath = "/releasenotes/" + version + "_" + lang + ".properties";

		Releasenotes releasenotes = new Releasenotes();
		releasenotes.setVersion(version);
		releasenotes.setLang(lang);
		Properties releasenotesProp = new Properties();

		releasenotesProp.load(Config.class.getClassLoader().getResourceAsStream(releasenotesPath));
		if (releasenotes != null) {
			for (Object key : releasenotesProp.keySet()) {
				String releasenoteKey = (String) key;
				if (releasenoteKey.startsWith(Releasenotes.PREFIX_IMPROVEMENTS))
					releasenotes.addImprovement(releasenotesProp.getProperty(releasenoteKey));
				else if (releasenoteKey.startsWith(Releasenotes.PREFIX_FIXES))
					releasenotes.addFix(releasenotesProp.getProperty(releasenoteKey));
				else if(releasenoteKey.equals(Releasenotes.RELEASE_DATE)){
					releasenotes.setReleasedate(releasenotesProp.getProperty(releasenoteKey));
				}
			}

		}

		return releasenotes.toJson();
	}

}
