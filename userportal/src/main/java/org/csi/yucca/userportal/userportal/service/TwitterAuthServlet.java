/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.twitter.TwitterUser;
import org.csi.yucca.userportal.userportal.utils.Config;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;
import twitter4j.conf.ConfigurationBuilder;

@WebServlet(description = "Twitter Authentication Service", urlPatterns = { "/api/proxy/twitter/auth" }, asyncSupported = false)
public class TwitterAuthServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String SESSION_KEY_TWITTER_REQUEST_TOKEN = "requestToken";
	private static final String SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING = "virtualEntityInSession";
	private static final String SESSION_KEY_TWITTER_VIRTUAL_ENTITY_REDIRECT_URL = "twitterVirtualEntityRedirectUrl";

	static Logger log = Logger.getLogger(TwitterAuthServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("TwitterAuthServlet::doGet] - START ");

		Twitter twitter = getTwitterApi(request);
		
		
		for (String key : request.getParameterMap().keySet()) {
			String value = request.getParameter(key);
			System.err.println("k: " + key + " v: " + value);

		}
		
		String redirectUrl = "/";

		try {
			RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
			if (requestToken == null && request.getParameter("denied") == null) {
				// first call, no requestToken, go to twitter to retrieve
				// memorize virtual entity in session
				twitter = refreshTwitterApi(request);
				requestToken = twitter.getOAuthRequestToken();
				request.getSession().setAttribute(SESSION_KEY_TWITTER_REQUEST_TOKEN, requestToken);
				String virtualEntityWaiting = request.getParameter(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING);
				if (virtualEntityWaiting != null)
					request.getSession().setAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING, virtualEntityWaiting);

				String tenant = request.getParameter("tenant");
				String virtualentityCode = request.getParameter("virtualentityCode");

				String nextUrl = request.getContextPath() + "/#/management/newVirtualentity/"+tenant;
				if("edit".equals(request.getParameter("vitualEntityAction"))){
					nextUrl = request.getContextPath() + "/#/management/editVirtualentity/"+tenant+"/"+virtualentityCode;
				}
				
				request.getSession().setAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_REDIRECT_URL, nextUrl);

				
				redirectUrl = requestToken.getAuthenticationURL();
			} else {
				// coming back from twitter
				try {
					// String oauthToken = request.getParameter("oauth_token");
					if (request.getParameter("denied") != null) {
						// the user has cancel the request or twitter has denied
						// the access
						log.info("TwitterAuthServlet::doGet] twitter response denied");
					} else {
						String verifier = request.getParameter("oauth_verifier");
						AccessToken oAuthAccessToken = twitter.getOAuthAccessToken(verifier);
						twitter4j.User twitterUserVerified = twitter.verifyCredentials();

						TwitterUser twitterUser = new TwitterUser(twitterUserVerified, oAuthAccessToken.getToken(), oAuthAccessToken.getTokenSecret());
						request.getSession(true).setAttribute(TwitterUserServlet.SESSION_KEY_TWITTER_USER, twitterUser);
					}
					String virtualEntityWaiting = (String) request.getSession().getAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING);
					redirectUrl = (String) request.getSession().getAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_REDIRECT_URL);
					if (virtualEntityWaiting != null)
						redirectUrl += "?" + SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING + "=" + virtualEntityWaiting;
					request.getSession().removeAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_REDIRECT_URL);
					request.getSession().removeAttribute(SESSION_KEY_TWITTER_REQUEST_TOKEN);
					request.getSession().removeAttribute(SESSION_KEY_TWITTER_VIRTUAL_ENTITY_WAITING);
				} catch (TwitterException e) {
					if (e.getStatusCode() == 401) {
						log.info("TwitterAuthServlet::doGet] error status 401: " + e.getMessage());
					} else {
						log.error("TwitterAuthServlet::doGet] error status " + e.getStatusCode() + ": " + e.getMessage());
					}
				} finally {
					request.getSession().removeAttribute("requestToken");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ServletException(e.getMessage());
		} finally {
			log.info("TwitterAuthServlet::doGet] - END ");
		}
		response.sendRedirect(response.encodeRedirectURL(redirectUrl));

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[TwitterAuthServlet::doPost] - START");
		try {
			doGet(request, response);
		} finally {
			log.debug("[TwitterAuthServlet::doPost] - END");
		}
	}

	private Twitter getTwitterApi(HttpServletRequest request) throws IOException {
		Twitter twitter = (Twitter) request.getSession().getAttribute("twitter");

		if (twitter == null) {
			refreshTwitterApi(request);
		}
		return twitter;
	}

	private Twitter refreshTwitterApi(HttpServletRequest request) throws IOException {

		Properties config = Config.loadServerConfiguration();

		ConfigurationBuilder cb = new ConfigurationBuilder();

		cb.setHttpProxyHost(config.getProperty(Config.HTTP_PROXY_HOST_KEY));
		cb.setHttpProxyPort(new Integer(config.getProperty(Config.HTTP_PROXY_PORT_KEY)));
		cb.setOAuthConsumerKey(config.getProperty(Config.TWITTER_CONSUMER_KEY));
		cb.setOAuthConsumerSecret(config.getProperty(Config.TWITTER_CONSUMER_SECRET_KEY));

		Twitter twitter = new TwitterFactory(cb.build()).getInstance();
		request.getSession().setAttribute("twitter", twitter);
		return twitter;
	}

}
