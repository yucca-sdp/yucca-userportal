/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.delegate;

import java.io.IOException;
import java.io.StringReader;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import net.minidev.json.JSONObject;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.store.LoadTokenFromApiResponse;
import org.csi.yucca.userportal.userportal.service.SAML2ConsumerServlet;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.JWTUtil;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JWTDelegate {

	public static Logger log = Logger.getLogger(JWTDelegate.class);

	public static LoadTokenFromApiResponse loadTokenFromSaml2(String b64samlAssertion) {
		LoadTokenFromApiResponse loadTokenFromSaml = null;
		try {
			Properties config = Config.loadServerConfiguration();
			String apiBaseUrl = config.getProperty(Config.TOKEN_FROM_SAML_URL_KEY) ;
			String user = config.getProperty(Config.TOKEN_FROM_SAML_USER_KEY);
			config = Config.loadAuthorizationConfiguration();
			String password = config.getProperty(Config.TOKEN_FROM_SAML_PASSWORD_KEY);
	
			Map<String, String> postData = new HashMap<String, String>();
			
			postData.put("grant_type", "urn:ietf:params:oauth:grant-type:saml2-bearer");
			postData.put("assertion", b64samlAssertion);
			
			
			String result = HttpDelegate2.executePost(apiBaseUrl, user, password, "application/x-www-form-urlencoded", "utf-8", null, postData);
			
			SAML2ConsumerServlet.log.info("[loadTokenFromSaml2]-->"+result.toString());
			
			Gson gson = new GsonBuilder().create();
			loadTokenFromSaml = gson.fromJson(result.toString(), LoadTokenFromApiResponse.class);
	
					
		} catch (Exception e) {
			SAML2ConsumerServlet.log.error("[SAML2ConsumerServlet::loadTokenFromSaml2] - ERROR " + e.getMessage(),e);
		}
		return loadTokenFromSaml;
	}

	
	public static String getJWTFromToken(LoadTokenFromApiResponse loadTokenFromApiResponse) throws Exception {

		log.debug("[SAML2ConsumerServlet::getJWT] - START");
		if (loadTokenFromApiResponse==null)
			throw new Exception("Token is null.");
		String jwt = null;
		Boolean valid= false;
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" xmlns:xsd1=\"http://dto.oauth2.identity.carbon.wso2.org/xsd\">";
				xmlInput += "   <soapenv:Header/>";
				xmlInput += "   <soapenv:Body>";
				xmlInput += "      <xsd:validate>";
				xmlInput += "         <xsd:validationReqDTO>";
				xmlInput += "            <xsd1:accessToken>";
				xmlInput += "               <xsd1:identifier>"+loadTokenFromApiResponse.getAccess_token()+"</xsd1:identifier>";
				xmlInput += "               <xsd1:tokenType>bearer</xsd1:tokenType>";
				xmlInput += "            </xsd1:accessToken>";
				xmlInput += "            <xsd1:context>";
				xmlInput += "               <xsd1:key></xsd1:key>";
				xmlInput += "               <xsd1:value></xsd1:value>";
				xmlInput += "            </xsd1:context>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_ROLE)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_NICKNAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_SHIB_LIVAUTH)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            </xsd:validationReqDTO>";
				xmlInput += "      </xsd:validate>";
				xmlInput += "   </soapenv:Body>";
				xmlInput += "</soapenv:Envelope>";
				
			String SOAPAction = "validate";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_URL_KEY);
			String user = config.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_USER_KEY);
			String password = authConfig.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadRoles] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			NodeList fieldsNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (fieldsNodeList != null) {
				
				for (int i = 0; i < fieldsNodeList.getLength(); i++) {

					Node fieldNode = fieldsNodeList.item(i);
					
					
					if (fieldNode.getNodeName().endsWith("valid")){
						log.debug("Valid|"+fieldNode.getTextContent()+"|");
						valid = Boolean.parseBoolean(fieldNode.getTextContent());
					}
					if (fieldNode.getNodeName().endsWith("authorizationContextToken"))
					{
						NodeList authContNodeList = fieldNode.getChildNodes();
						if (authContNodeList!=null)
						{
							for (int j = 0; j < authContNodeList.getLength(); j++) {
								Node authNode = authContNodeList.item(i);
								log.debug("authNode.getNodeName |"+authNode.getNodeName());
								if (authNode.getNodeName().endsWith("tokenString")) {
									log.debug("tokenString |"+authNode.getTextContent());
									jwt = authNode.getTextContent();
								}
							}
						}
					}
				}
			}

		} finally {
			log.debug("[SAML2ConsumerServlet::getJWT] - END");
		}
		if (valid) {
			return jwt;
		}
		else
			return null;
	}


}
