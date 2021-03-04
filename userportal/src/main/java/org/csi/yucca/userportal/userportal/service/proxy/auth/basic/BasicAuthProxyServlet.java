/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service.proxy.auth.basic;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.ssl.Base64;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public abstract class BasicAuthProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(BasicAuthProxyServlet.class);

	// RemoteUserStoreManagerServiceStub remoteUserStoreManagerServiceStub;
	//
	// private String isAdminUsername = "";
	// private String isAdminPassword = "";
	// private String isServerUrl = "";

	protected String apiBaseUrl;

	@Override
	public void init() throws ServletException {
		super.init();
		setApiBaseUrl();
	}

	protected abstract void setApiBaseUrl();

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		log.debug("[BasicAuthProxyServlet::doGet] - START");

		String tenant = request.getParameter("tenant");

		final String authorizationHeader = request.getHeader("Authorization");

		try {
			if (authorizationHeader != null && authorizationHeader.startsWith("Basic")) {
				// Authorization: Basic base64credentials
				String base64Credentials = authorizationHeader.substring("Basic".length()).trim();
				boolean isValidUser = verifyBasicAuth(tenant, base64Credentials);
				if (isValidUser) {
					GetMethod getMethod = new GetMethod(createTargetUrlWithParameters(apiBaseUrl, request));

					getMethod.setRequestHeader("Authorization", authorizationHeader);

					HttpClient httpclient = new HttpClient();
					int result = httpclient.executeMethod(getMethod);
					response.setStatus(result);
					log.info("[BasicAuthProxyServlet::doGet] Content-Type: " + getMethod.getResponseHeader("Content-Type"));
					if (getMethod.getResponseHeader("Content-Type") != null)
						response.setContentType(getMethod.getResponseHeader("Content-Type").getValue());
					log.info("[BasicAuthProxyServlet::doGet] getResponseCharSet: " + getMethod.getResponseCharSet());
					response.setCharacterEncoding("UTF-8");

					Header contentDisposition = getMethod.getResponseHeader("Content-Disposition");
					if (contentDisposition != null)
						response.setHeader("Content-Disposition", getMethod.getResponseHeader("Content-Disposition").getValue());

					byte[] responsBytes = getMethod.getResponseBody();
					String jsonOut = new String(responsBytes, "UTF-8");
					if (isJSONPRequest(request))
						jsonOut = getCallbackMethod(request) + "(" + jsonOut + ")";
					PrintWriter out = response.getWriter();
					out.println(jsonOut);
					out.close();
				} else {
					ServletException error = new ServletException("Unauthorized Access, invalid credentials");
					throw error;
				}
			} else {
				ServletException error = new ServletException("Unauthorized Access, user basic authentication");
				throw error;
			}

		} catch (Exception e) {
			log.error("[BasicAuthProxyServlet::doGet] - ERROR " + e.getMessage());
			throw new ServletException(e);
		} finally {
			log.debug("[BasicAuthProxyServlet::doGet] - END");
		}

	}

	protected String createTargetUrlWithParameters(String apiBaseUrl, HttpServletRequest request) throws IOException {

		Map<String, String[]> parameterMap = new HashMap<String, String[]>(request.getParameterMap());

		String parameters = cleanParameters(parameterMap);
		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");

		return apiBaseUrl + path;

	}

	protected String cleanParameters(Map<String, String[]> parameterMap) throws UnsupportedEncodingException {
		String parametersOut = "?";
		if (parameterMap != null && parameterMap.size() > 0) {
			int i = 0;
			for (String key : parameterMap.keySet()) {
				i++;
				if (!key.trim().equalsIgnoreCase("callback")) {
					parametersOut += key + "=" + URLEncoder.encode(parameterMap.get(key)[0], "UTF-8").replace("+", "%20");
					if (i < parameterMap.size()) {
						parametersOut += "&";
					}
				}
			}
		}
		if (parametersOut.equals("?"))
			parametersOut = "";

		return parametersOut;
	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	private boolean verifyBasicAuth(String tenantCode, String credentials) throws IOException, KeyManagementException, NoSuchAlgorithmException,
			ParserConfigurationException, SAXException {

		log.debug("[BasicAuthProxyServlet::verifyBasicAuth] - START");

		boolean isValidUser = false;
		try {
			String decodedCredentials = new String(new Base64().decode(credentials.getBytes()));
			String userName = decodedCredentials.split(":")[0];
			String password = decodedCredentials.split(":")[1];

			if (("" + tenantCode).equals(userName)) {

				String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
				xmlInput += "   <soapenv:Header/>";
				xmlInput += "   <soapenv:Body>";
				xmlInput += "      <ser:authenticate>";
				xmlInput += "		<ser:userName>" + userName + "</ser:userName>";
				xmlInput += "         <ser:credential>" + password + "</ser:credential>";
				xmlInput += "      </ser:authenticate>";
				xmlInput += "   </soapenv:Body>";
				xmlInput += "</soapenv:Envelope>";

				String SOAPAction = "authenticate";

				Properties config = Config.loadServerConfiguration();
				Properties authConfig = Config.loadAuthorizationConfiguration();

				String webserviceUrl = config.getProperty(Config.RBAC_USER_STORE_WEBSERVICE_URL_KEY);
				String rbacUser = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
				String rbacPassword = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
				String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, rbacUser, rbacPassword, xmlInput, SOAPAction, "text/xml");

				log.debug("[BasicAuthProxyServlet::verifyBasicAuth] - webServiceResponse: " + webServiceResponse);

				DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
				DocumentBuilder db = dbf.newDocumentBuilder();

				InputSource is = new InputSource(new StringReader(webServiceResponse));
				Document doc = db.parse(is);

				Node resultNode = doc.getFirstChild().getFirstChild().getFirstChild().getFirstChild();

				String nodeValue = resultNode.getTextContent();
				isValidUser = "true".equals(nodeValue);
			} else {
				log.warn("Richiamata API per tenant:[" + tenantCode + "] con utente:[" + userName + "]");
				isValidUser = false;
			}

		} finally {
			log.debug("[BasicAuthProxyServlet::verifyBasicAuth] - END");
		}
		return isValidUser;
	}

	// private boolean processSecurity(String tenantCode, String credentials) {
	// String decodedCredentials = new String(new
	// Base64().decode(credentials.getBytes()));
	// String userName = decodedCredentials.split(":")[0];
	// String password = decodedCredentials.split(":")[1];
	//
	// boolean isValidUser = false;
	//
	// if (("" + tenantCode).equals(userName)) {
	// try {
	// if (remoteUserStoreManagerServiceStub == null) {
	// synchronized (RemoteUserStoreManagerServiceStub.class) {
	// if (remoteUserStoreManagerServiceStub == null) {
	// remoteUserStoreManagerServiceStub = createAdminClients();
	// }
	// }
	// }
	// isValidUser = remoteUserStoreManagerServiceStub.authenticate(userName,
	// password);
	// } catch (Exception e) {
	// log.error("Errore durante il richiamo dell'IS per tenant:[" + tenantCode
	// + "] con utente:[" + userName + "]", e);
	// }
	// return isValidUser;
	// } else {
	// log.warn("Richiamata API per tenant:[" + tenantCode + "] con utente:[" +
	// userName + "]");
	// return false;
	// }
	// }

	// private RemoteUserStoreManagerServiceStub createAdminClients() {
	//
	// RemoteUserStoreManagerServiceStub remoteUserStoreManagerServiceStub =
	// null;
	// try {
	// /**
	// * Create a configuration context. A configuration context contains
	// * information for axis2 environment. This is needed to create an
	// * axis2 service client
	// */
	// ConfigurationContext configContext =
	// ConfigurationContextFactory.createConfigurationContextFromFileSystem(null,
	// null);
	// /**
	// * end point url with service name
	// */
	// // RemoteUserStoreManager
	// String remoteUserStoreManagerServiceEndPoint = isServerUrl +
	// "/services/RemoteUserStoreManagerService";
	//
	// remoteUserStoreManagerServiceStub = new
	// RemoteUserStoreManagerServiceStub(configContext,
	// remoteUserStoreManagerServiceEndPoint);
	// ServiceClient remoteUserStoreManagerServiceClient =
	// remoteUserStoreManagerServiceStub._getServiceClient();
	// Options optionRemoteUser =
	// remoteUserStoreManagerServiceClient.getOptions();
	// setProxyToOptions(optionRemoteUser, isAdminUsername, isAdminPassword);
	// String remoteUserStoreManagerAuthCookie = (String)
	// remoteUserStoreManagerServiceStub._getServiceClient().getServiceContext()
	// .getProperty(HTTPConstants.COOKIE_STRING);
	//
	// } catch (Exception e) {
	// log.error("Error init client to IS.", e);
	// e.printStackTrace();
	// }
	//
	// return remoteUserStoreManagerServiceStub;
	// }

	// private void setProxyToOptions(Options option, String username, String
	// password) {
	// /**
	// * Setting a authenticated cookie that is received from Carbon server.
	// * If you have authenticated with Carbon server earlier, you can use
	// * that cookie, if it has not been expired
	// */
	// option.setProperty(HTTPConstants.COOKIE_STRING, null);
	// /**
	// * Setting proxy property if exists
	// */
	// /**
	// * Setting basic auth headers for authentication for carbon server
	// */
	// HttpTransportProperties.Authenticator auth = new
	// HttpTransportProperties.Authenticator();
	// auth.setUsername(username);
	// auth.setPassword(password);
	// auth.setPreemptiveAuthentication(true);
	// option.setProperty(HTTPConstants.AUTHENTICATE, auth);
	// option.setManageSession(true);
	// option.setCallTransportCleanup(true);
	// }

}
