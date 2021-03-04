/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.service.yucca;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.intro.delegate.HttpDelegate;
import org.csi.yucca.userportal.intro.dto.RecaptchaResponse;
import org.csi.yucca.userportal.intro.dto.yucca.YuccaTenantRequest;
import org.csi.yucca.userportal.intro.dto.yucca.YuccaTenantRequestFormData;
import org.csi.yucca.userportal.intro.utils.Config;

import com.google.gson.Gson;

/*import org.csi.yucca.userportal.userportal.entity.admin.tenant.Tenant;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;*/

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;

@WebServlet(description = "Request a tenant area on Yucca", urlPatterns = { "/service/yucca/tenantrequest" }, asyncSupported = true)
public class TenantRequestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(TenantRequestServlet.class);
	
	private static String EMAIL_BACKOFFICE;
	private static String EMAIL_FROM;
	private static String EMAIL_HOST;
	private static String SITE_SECRET;
	
	protected void setProperties() {
		try {
			Properties config = Config.loadIntroConfiguration();
			EMAIL_BACKOFFICE = config.getProperty(Config.BACKOFFICE_EMAIL);
			EMAIL_FROM = config.getProperty(Config.FROM_EMAIL);
			EMAIL_HOST = config.getProperty(Config.HOST_EMAIL);
			SITE_SECRET = config.getProperty(Config.SITESECRET_RECAPTCHA);
			log.debug("[TenantRequestServlet::setProperties] - Properties set");
		} catch (IOException e) {
			log.error("[TenantRequestServlet::setProperties] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}
	
	private void verifyRecaptchaToken(String token, String remoteAddress) throws Exception{
		log.debug("[TenantRequestServlet::verifyRecaptchaToken] - Verifying recaptcha");
		
		String RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify?secret=" + SITE_SECRET + "&response=" + token + "&remoteip=" + remoteAddress;
	
		String recaptchaResponse = HttpDelegate.getInstance().doGet(RECAPTCHA_URL, null, null, null, null, null);
		
		Gson g = new Gson();
		RecaptchaResponse response = g.fromJson(recaptchaResponse, RecaptchaResponse.class);
		
		if(response.getSuccess() != "true") {			
			throw new Exception("Invadlid Captcha Token");
		}
	}
	
	private void sendEmail(String toAddress, String messageBody) throws MessagingException{
		log.debug("[TenantRequestServlet::sendEmail] - Sending email to: " + toAddress + 
				"\nBody of the message: " + messageBody);
		
		// Get system properties
	    Properties properties = System.getProperties();
	 
	    // Setup mail server
	    properties.setProperty("mail.smtp.host", EMAIL_HOST);
	    
		// Get the default Session object.
	    Session session = Session.getDefaultInstance(properties);
	    
	         // Create a default MimeMessage object.
	         MimeMessage message = new MimeMessage(session);
	         
	         // Set From: header field of the header.
	         message.setFrom(new InternetAddress(EMAIL_FROM));
	         
	         // Set To: header field of the header.
	         message.addRecipient(Message.RecipientType.TO, new InternetAddress(toAddress));
	         
	         // Set Subject: header field
	         message.setSubject("Invio richiesta area di lavoro su Yucca");
	         
	         // Now set the actual message
	         message.setContent(messageBody, "text/html");
	         
	         // Send message
	         Transport.send(message);
	         
	}
	
	private String getEmailBodyForBackoffice(YuccaTenantRequestFormData formData) {
		return "<!doctype html>" + 
	      "<html lang=\"it\">" +
	      "<head>" +
	        "<title>Contatta il team di Yucca</title>" +
	      "</head>" + 
	      "<body>" +
	        "<p>Un utente ha inviato una nuova richiesta:</p>" +
	        getFormDataForEmail(formData) + 
	        "<p>&nbsp;</p>" +
	        "<p><em>Team Smartdatanet</em></p>" +
	      "</body>" +
	     "</html>";
	}
	
	private String getEmailBodyForRequester (YuccaTenantRequestFormData formData) {
		return "<!doctype html>" + 
			      "<html lang=\"it\">" +
			      "<head>" +
			        "<title>[Yucca] Riepilogo dati inviati</title>" +
			      "</head>" + 
			      "<body>" +
			      	"<h2>Ti diamo il benvenuto in Yucca!</h2>" +
			      	"<p>Grazie per aver inviato la tua richiesta. Nei prossimi giorni ti contatteremo per procedere con l&apos;apertura della tua area di lavoro.<br />" +
			      	"Ecco i dati che ci hai inviato:</p>" +
			      	getFormDataForEmail(formData) +
			        "<p>Un saluto cordiale<br /><em>Team Smartdatanet</em></p>" +
			      "</body>" +
			     "</html>";
	}
	
	private String getFormDataForEmail(YuccaTenantRequestFormData formData) {
		return "<dl>" + 
				"<dt style='font-weight: bold'>Nome:</dt>" + 
				"<dd>" + formData.getName() + "</dd>" + 
				"<dt style='font-weight: bold'>Cognome:</dt>" + 
				"<dd>" + formData.getSurname() + "</dd>" + 
				"<dt style='font-weight: bold'>Ruolo:</dt>" + 
				"<dd>" + formData.getRole() + "</dd>" + 
				"<dt style='font-weight: bold'>Email di contatto:</dt>" + 
				"<dd>" + formData.getEmail() + "</dd>" + 
				"<dt style='font-weight: bold'>Telefono:</dt>" + 
				"<dd>" + formData.getTelephone() + "</dd>" + 
				"<dt style='font-weight: bold'>Azienda/organizzazione:</dt>" + 
				"<dd>" + formData.getDenomination() + "</dd>" + 
				"<dt style='font-weight: bold'>Per cosa pensi di utilizzare Yucca?</dt>" + 
				"<dd>" + formData.getReason() + "</dd>";
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		setProperties(); // È il posto adatto per valorizzare le properties?
		
		log.debug("[TenantRequestServlet::doPost] - Triggered post API");
		
		String recaptchaToken;
		YuccaTenantRequestFormData formData;
		
		try {
			if (request != null) {
				String body = IOUtils.toString(request.getInputStream());
				Gson g = new Gson();
				YuccaTenantRequest yuccaTenantRequest = g.fromJson(body, YuccaTenantRequest.class);
				
				recaptchaToken = yuccaTenantRequest.getRecaptcha();
				formData = yuccaTenantRequest.getData();
				if (recaptchaToken.length() > 1 && formData.getEmail().length() > 1) { // Recaptcha token and form's email is not null
					verifyRecaptchaToken(recaptchaToken, request.getRemoteAddr());
					
					// Send email to the requester
					sendEmail(formData.getEmail(), getEmailBodyForRequester(formData));
					
					// Send email to backoffice
					sendEmail(EMAIL_BACKOFFICE, getEmailBodyForBackoffice(formData));
					
				} else throw new Exception("Recaptcha or Data parameter not found");
			} else throw new Exception("Request null");			

			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			//response.addHeader("Access-Control-Allow-Origin", "*");
			
			PrintWriter out = response.getWriter();

			out.println("{\"response\": \"Request Sent\"}");
			out.close();
		} catch (Exception e) {
			log.error("[TenantRequestServlet::doPost] - ERROR " + e.getMessage());
			response.sendError(500, e.getMessage());
			e.printStackTrace();
			throw new ServletException(e.getMessage(), e.getCause());
		}
	}

}
