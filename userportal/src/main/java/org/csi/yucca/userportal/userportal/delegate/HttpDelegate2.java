/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.delegate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.info.User;

public class HttpDelegate2 {

	static Logger log = Logger.getLogger(HttpDelegate.class);
	
//	public static String executeGet(String targetUrl, String contentType, String characterEncoding, Map<String, String> parameters) throws IOException {
//			return executeGet(targetUrl, contentType, characterEncoding, parameters, false, null);
//	}
	
	public static String executeGet(String targetUrl, String contentType, String characterEncoding, Map<String, String> parameters, boolean useJwtAuth, User user) throws IOException {
		log.debug("[HttpDelegate::executeGet] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executeGet] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			log.debug("[HttpDelegate::executeGet] - targetUrl: " + targetUrl);
			GetMethod get = new GetMethod(targetUrl);
			

			//contentType = "application/x-www-form-urlencoded";
			get.setRequestHeader("Content-Type", contentType);
			
			if(useJwtAuth && user!=null && user.getSecretTempJwtRaw()!=null){
				get.addRequestHeader("x-auth-token", user.getSecretTempJwtRaw());
			}


			HttpClient httpclient = new HttpClient();
			try {
				resultCode = httpclient.executeMethod(get);
				log.debug("[HttpDelegate::executeGet] - get result: " + resultCode);
				result = get.getResponseBodyAsString();
			} finally {
				get.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executeGet] END");
		}
		return result;
	}
	
	
	public static String executePost(String targetUrl, String basicUser, String basicPassword, String contentType, String characterEncoding, Map<String, String> parameters, String data) throws Exception {
		log.debug("[HttpDelegate::executePost] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			
			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);
			PostMethod post = new PostMethod(targetUrl);

			RequestEntity requestEntity = new StringRequestEntity(data, contentType, characterEncoding);
			post.setRequestEntity(requestEntity);
			

			post.setRequestHeader("Content-Type", contentType);
			HttpClient httpclient = new HttpClient();

			if(basicUser!=null && basicPassword!=null){
				post.setDoAuthentication( true );
				String userPassowrd  = basicUser + ":" + basicPassword;
				byte[] encoding = Base64.encodeBase64(userPassowrd.getBytes());
				post.setRequestHeader("Authorization", "Basic " + new String(encoding));
				
			}
			
			try {
				resultCode = httpclient.executeMethod(post);
				result = post.getResponseBodyAsString();
				if (resultCode >= 400) {
					log.error("[HttpDelegate::executePost] - post result: " + resultCode);
					log.error(post.getResponseHeaders().toString());
					throw new Exception(result);
				}
				log.debug("[HttpDelegate::executePost] - post result: " + resultCode);
			} finally {
				post.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executePost] END");
		}
		return result;
	}

	
	
	public static String executePost(String targetUrl, String basicUser, String basicPassword, String contentType, String characterEncoding, Map<String, String> parameters,  Map<String, String> postData) throws Exception {
		log.debug("[HttpDelegate::executePost] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			
			PostMethod post = new PostMethod(targetUrl);
			log.info("[HttpDelegate::executePost] Posting data: " + postData.size());
			if (postData!=null && !postData.isEmpty())
			{
				List<NameValuePair> parts = new ArrayList<NameValuePair>();

				Set<Entry<String, String>> entryPost = postData.entrySet();
				
				for (Entry<String, String> entry : entryPost) {
					parts.add(new NameValuePair(entry.getKey(), entry.getValue()));
					log.info("[HttpDelegate::executePost] adding data: " + entry.getKey()+":"+entry.getValue());
				}
	
		        post.setRequestBody(parts.toArray(new NameValuePair[0]));
			
			}
			post.setRequestHeader("Content-Type", contentType);
			HttpClient httpclient = new HttpClient();

			if(basicUser!=null && basicPassword!=null){
				post.setDoAuthentication( true );
				String userPassowrd  = basicUser + ":" + basicPassword;
				byte[] encoding = Base64.encodeBase64(userPassowrd.getBytes());
				post.setRequestHeader("Authorization", "Basic " + new String(encoding));
				
			}
			
			try {
				resultCode = httpclient.executeMethod(post);
				result = post.getResponseBodyAsString();
				if (resultCode >= 400) {
					log.error("[HttpDelegate::executePost] - post result: " + resultCode);
					log.error(post.getResponseHeaders().toString());
					throw new Exception(result);
				}
				log.debug("[HttpDelegate::executePost] - post result: " + resultCode);
			} finally {
				post.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executePost] END");
		}
		return result;
	}
	
	public static String executeDelete(String targetUrl, String contentType, String characterEncoding, Map<String, String> parameters) throws IOException {
		log.debug("[HttpDelegate::executeDelete] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executeDelete] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			log.debug("[HttpDelegate::executeDelete] - targetUrl: " + targetUrl);
			DeleteMethod delete = new DeleteMethod(targetUrl);
			

			//contentType = "application/x-www-form-urlencoded";
			delete.setRequestHeader("Content-Type", contentType);

			HttpClient httpclient = new HttpClient();
			try {
				resultCode = httpclient.executeMethod(delete);
				log.debug("[HttpDelegate::executeDelete] - delete result: " + resultCode);
				result = delete.getResponseBodyAsString();
			} finally {
				delete.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executeDelete] END");
		}
		return result;
	}
	
	public static void main(String[] args) throws Exception {
		
		String apiBaseUrl = "" ;
		String user = "";
		String password = "";

		
		Map<String, String> postData = new HashMap<String, String>();
		
		postData.put("grant_type", "urn:ietf:params:oauth:grant-type:saml2-bearer");
		postData.put("assertion", "sssss");
		
		
		String result = HttpDelegate2.executePost(apiBaseUrl, user, password, "application/x-www-form-urlencoded", "utf-8", null, postData);
		
		System.out.println(result);
	}
}