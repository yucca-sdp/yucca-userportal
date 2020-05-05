/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.twitter.TwitterUser;
import org.csi.yucca.userportal.userportal.utils.json.GSONExclusionStrategy;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@WebServlet(description = "Twitter Authentication Service", urlPatterns = { "/api/proxy/twitter/user" }, asyncSupported = false)
public class TwitterUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public static final String SESSION_KEY_TWITTER_USER = "twitter-user";

	static Logger log = Logger.getLogger(TwitterUserServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("TwitterAuthServlet::doGet] - START ");

		String responseJson = "";
		response.setContentType("application/json; charset=utf-8");
		response.setCharacterEncoding("UTF-8");

		try {
			TwitterUser twitterUser = (TwitterUser) request.getSession(true).getAttribute(SESSION_KEY_TWITTER_USER);

			String result = "KO";
			String message = "User not found";

			if (twitterUser != null) {
				if("clear".equals(request.getParameter("action"))){
					request.getSession(true).removeAttribute(SESSION_KEY_TWITTER_USER);
					result = "KO";
					message = "User not found";
					responseJson = new ResponseJson(result, message, null).toJson();

				}
				else{
					result = "OK";
					message = "User found";
					responseJson = new ResponseJson(result, message, twitterUser).toJson();
				}
			}

			// if (isJSONPRequest(request))
			// responseJson = getCallbackMethod(request) + "(" + new
			// ResponseJson(result, message, twitterUser).toJson() + ")";
			// else {
			// responseJson = new ResponseJson(result, message,
			// twitterUser).toJson();
			// }
		} catch (Exception e) {
			log.error("[InfoServlet::doGet] - ERROR " + e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseJson = "{\"message\":\"Error while retrieving Twitter User: " + e.getMessage() + "  \"}";

			// response.getWriter().write(responseJson);
			// response.sendError(500, "An error occured: " + e.getMessage());
		} finally {
			log.debug("[InfoServlet::doGet] - END");
		}
		if (isJSONPRequest(request))
			responseJson = getCallbackMethod(request) + "(" + responseJson + ")";

		PrintWriter out = response.getWriter();

		out.println(responseJson);
		out.close();

	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	private class ResponseJson {
		private String result;
		private String message;
		private TwitterUser twitterUser;

		@SuppressWarnings("unused")
		public ResponseJson() {
			super();
		}

		public ResponseJson(String result, String message, TwitterUser twitterUser) {
			super();
			this.result = result;
			this.message = message;
			this.twitterUser = twitterUser;
		}

		@SuppressWarnings("unused")
		public String getResult() {
			return result;
		}

		@SuppressWarnings("unused")
		public void setResult(String result) {
			this.result = result;
		}

		@SuppressWarnings("unused")
		public String getMessage() {
			return message;
		}

		@SuppressWarnings("unused")
		public void setMessage(String message) {
			this.message = message;
		}

		@SuppressWarnings("unused")
		public TwitterUser getTwitterUser() {
			return twitterUser;
		}

		@SuppressWarnings("unused")
		public void setTwitterUser(TwitterUser twitterUser) {
			this.twitterUser = twitterUser;
		}

		public String toJson() {
			Gson gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).create();
			return gson.toJson(this);
		}

	}

}
