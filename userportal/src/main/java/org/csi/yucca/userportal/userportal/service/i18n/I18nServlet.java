/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.i18n;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import twitter4j.JSONArray;
import twitter4j.JSONException;
import twitter4j.JSONObject;

//@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/i18n" }, initParams = { @WebInitParam(name = "language", value = "it"), }, asyncSupported = true)
public abstract class I18nServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(I18nServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[I18nServlet::doGet] - START");
		try {

			String language = request.getParameter("language");
			JSONArray messages;
			if (language == null) {
				language = getServletConfig().getInitParameter("language");
			}

			log.debug("[I18nServlet::doGet] - language: " + language);

			Locale currentLocale = new Locale(language);

			messages = loadMessages(currentLocale);

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

	protected abstract JSONArray loadMessages(Locale currentLocale) throws MalformedURLException;

	protected abstract String formatMessages(JSONArray elements, Locale locale);

	public static Map<String, Object> toMap(JSONObject object) throws JSONException {
		Map<String, Object> map = new HashMap<String, Object>();

		if (object == null) {
			throw new JSONException("JSON is null");
		} else {
			Iterator<String> keysItr = object.keys();
			while (keysItr.hasNext()) {
				String key = keysItr.next();
				Object value = object.get(key);

				if (value instanceof JSONArray) {
					value = toList((JSONArray) value);
				}

				else if (value instanceof JSONObject) {
					value = toMap((JSONObject) value);
				}
				map.put(key, value);
			}
			return map;
		}
	}

	public static List<Object> toList(JSONArray array) throws JSONException {
		List<Object> list = new ArrayList<Object>();
		for (int i = 0; i < array.length(); i++) {
			Object value = array.get(i);
			if (value instanceof JSONArray) {
				value = toList((JSONArray) value);
			}

			else if (value instanceof JSONObject) {
				value = toMap((JSONObject) value);
			}
			list.add(value);
		}
		return list;
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[I18nServlet::doPost] - START");
		try {
			doGet(request, response);
		} finally {
			log.debug("[I18nServlet::doPost] - END");
		}
	}
}
