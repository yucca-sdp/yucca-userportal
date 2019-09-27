/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.auth;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.User;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.xml.sax.SAXException;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/termcondition" }, asyncSupported = true)
public class TermConditionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(TermConditionServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[TermConditionServlet::doGet] - START");
		try {
			String tenantCode = request.getParameter("tenantcode");
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);

			info.getUser().addAcceptTermConditionTenants(tenantCode);
			addClaim(info.getUser(), info.getUser().getAcceptTermConditionTenantsString());

			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);

			String infoJson = info.toJson();
			if (isJSONPRequest(request))
				infoJson = getCallbackMethod(request) + "(" + infoJson + ")";

			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(infoJson);
			out.close();
		} catch (Exception e) {
			log.error("[TermConditionServlet::doGet] - ERROR " + e.getMessage());
			e.printStackTrace();
			throw new ServletException(e.getMessage());
		} finally {
			log.debug("[TermConditionServlet::doGet] - END");
		}
	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	private void addClaim(User loggedUser, String termCoditionsTenants) throws KeyManagementException, NoSuchAlgorithmException, IOException,
			ParserConfigurationException, SAXException {

		log.debug("[SAML2ConsumerServlet::loadPermissions] - START");
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <ser:setUserClaimValue>";
			xmlInput += "         <ser:userName>" + loggedUser.getUsername() + "</ser:userName>";
			xmlInput += "         <ser:claimURI>" + AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS) + "</ser:claimURI>";
			xmlInput += "         <ser:claimValue>" + termCoditionsTenants + "</ser:claimValue>";
			xmlInput += "      </ser:setUserClaimValue>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "setUserClaimValue";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.RBAC_USER_STORE_WEBSERVICE_URL_KEY);
			String user = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
			String password = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadPermissions] - webServiceResponse: " + webServiceResponse);

		} finally {
			log.debug("[SAML2ConsumerServlet::loadPermissions] - END");
		}
	}

}
