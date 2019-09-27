/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.i18n;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Locale;
import java.util.Properties;

import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

import org.csi.yucca.userportal.userportal.utils.Config;

import twitter4j.JSONArray;
import twitter4j.JSONException;

@WebServlet(description = "Configuration language TAGS for clients", urlPatterns = { "/api/domains" }, initParams = { @WebInitParam(name = "language", value = "it"), }, asyncSupported = true)
public class DomainServiceServlet extends I18nServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected JSONArray loadMessages(Locale currentLocale) throws MalformedURLException {
		InputStream is = null;
		JSONArray json = null;
		try {
			Properties config = Config.loadServerConfiguration();
			
			is = new URL(config.getProperty(Config.API_ADMIN_URL_KEY) + "/1/public/domains?ecosystemCode=SDNET").openStream();

			BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
			String jsonText = null;
			jsonText = readAll(rd);
			json = new JSONArray(jsonText);

			is.close();
		} catch (JSONException ex) {
			ex.printStackTrace();
		} catch (IOException ex) {
			ex.printStackTrace();
		}

		return json;
	}

	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}

	protected String formatMessages(JSONArray elements, Locale locale) {
		log.debug("[I18nServlet::formatMessages] - START");
		StringBuffer sb = new StringBuffer("");
		String loc = locale.getLanguage().toLowerCase();
		try {
//			[
//			  {
//			    "langit": "Agricoltura",
//			    "langen": "Agriculture",
//			    "idDomain": 1,
//			    "domaincode": "AGRICULTURE",
//			    "deprecated": 0
//			  },
			
			for(int i = 0 ; i < elements.length() ; i++){
				String tagCode = elements.getJSONObject(i).getString("domaincode");
				String langEl = elements.getJSONObject(i).getString("lang"+loc);
			    sb.append("translations_" + locale.getLanguage() + "[\"" + tagCode + "\"] = \"" + langEl + "\";\n\n");
			}

		} catch (JSONException ex) {
			// TODO Auto-generated catch block
			ex.printStackTrace();
		} finally {
			log.debug("[I18nServlet::formatMessages] - END");
		}
		return sb.toString();
	}

}
