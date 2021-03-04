/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.entity.twitter.TwitterMessage;
import org.csi.yucca.userportal.userportal.entity.twitter.TwitterQuery;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.json.GSONExclusionStrategy;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@WebServlet(description = "Twitter Query Service", urlPatterns = { "/api/proxy/twitter/query" }, asyncSupported = false)
public class TwitterQueryServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	static Logger log = Logger.getLogger(TwitterQueryServlet.class);

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("TwitterQueryServlet::doGet] - START ");

		ResponseJson responseJson = new ResponseJson();
		response.setContentType("application/json; charset=utf-8");
		response.setCharacterEncoding("UTF-8");

		try {

			String SOAPAction = "invokeTwitter";
			// String twitterQueryJSon = request.getParameter("twitterQuery");
			StringBuffer twitterQueryJSon = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = request.getReader();
				while ((line = reader.readLine()) != null) {
					twitterQueryJSon.append(line);
					log.debug("[ApiProxyServlet::doPost] - request body: " + line);
				}
				reader.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

			TwitterQuery twitterQuery = TwitterQuery.fromJson(twitterQueryJSon.toString());
			String xmlInput = createXmlInput(twitterQuery);

			Properties config = Config.loadServerConfiguration();
			String webserviceUrl = config.getProperty(Config.TWITTER_POLLER_URL_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, null, null, xmlInput, SOAPAction, "text/xml");

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			dbf.setNamespaceAware(true);

			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			responseJson = parseResponse(doc);

		} catch (Exception e) {
			log.error("[TwitterQueryServlet::doGet] - ERROR " + e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseJson.setResult("KO");
			responseJson.setMessage("Error while executing Twitter Query: " + e.getMessage());

		} finally {
			log.debug("[InfoServlet::doGet] - END");
		}

		String responseJsonString = responseJson.toJson();
		if (isJSONPRequest(request))
			responseJsonString = getCallbackMethod(request) + "(" + responseJson.toJson() + ")";

		PrintWriter out = response.getWriter();

		out.println(responseJsonString);
		out.close();

	}

	private ResponseJson parseResponse(Document doc) {

		ResponseJson responseJson = new ResponseJson();
		boolean hasError = false;
		String errorCode = null;
		String errorMessage = null;

		TwitterMessage twitterMessage = new TwitterMessage();
		// NodeList invokeTwitterResponse =
		// doc.getElementsByTagName("ns:invokeTwitterResponse");
		// NodeList invokeTwitterResponse =
		// doc.getElementsByTagNameNS("http://twitterpoller.yucca.csi.org",
		// "invokeTwitterResponse");

		NodeList invokeTwitterResponse = doc.getFirstChild().getFirstChild().getFirstChild().getChildNodes();

		if (invokeTwitterResponse != null && invokeTwitterResponse.getLength() > 0) {

			for (int i = 0; i < invokeTwitterResponse.item(0).getChildNodes().getLength(); i++) {
				Node item = invokeTwitterResponse.item(0).getChildNodes().item(i);

				if ("errore".equals(item.getLocalName())) {
					if (item.getChildNodes().getLength() > 0) {
						hasError = true;

						for (int j = 0; j < item.getChildNodes().getLength(); j++) {
							Node element = item.getChildNodes().item(j);
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "twtErrorCode".equals(element.getLocalName()))
								errorCode = element.getTextContent().trim();
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "twtErrorMessage".equals(element.getLocalName()))
								errorMessage = element.getTextContent().trim();
						}
					}
				}
				if ("values".equals(item.getLocalName())) {
					Node components = item.getFirstChild();
					if (components != null) {
						for (int j = 0; j < components.getChildNodes().getLength(); j++) {
							Node element = components.getChildNodes().item(j);
							System.out.println("name: " + element.getLocalName() + " - value: " + element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "contributors".equals(element.getLocalName()))
								twitterMessage.setContributors(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "createdAt".equals(element.getLocalName()))
								twitterMessage.setCreatedAt(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "currentUserRetweetId".equals(element.getLocalName()))
								twitterMessage.setCurrentUserRetweetId(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "favoriteCount".equals(element.getLocalName()))
								twitterMessage.setFavoriteCount(new Integer(element.getTextContent()));
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "favorited".equals(element.getLocalName()))
								twitterMessage.setFavorited(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "getText".equals(element.getLocalName()))
								twitterMessage.setGetText(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "hashTags".equals(element.getLocalName()))
								twitterMessage.setHashTags(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lang".equals(element.getLocalName()))
								twitterMessage.setLang(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lat".equals(element.getLocalName()))
								twitterMessage.setLat(new Double(element.getTextContent()));
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lon".equals(element.getLocalName()))
								twitterMessage.setLon(new Double(element.getTextContent()));
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "media".equals(element.getLocalName()))
								twitterMessage.setMedia(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "mediaCnt".equals(element.getLocalName()))
								twitterMessage.setMediaCnt(new Integer(element.getTextContent()));
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "mediaUrl".equals(element.getLocalName()))
								twitterMessage.setMediaUrl(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "placeName".equals(element.getLocalName()))
								twitterMessage.setPlaceName(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "possiblySensitive".equals(element.getLocalName()))
								twitterMessage.setPossiblySensitive(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "retweet".equals(element.getLocalName()))
								twitterMessage.setRetweet(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "retweetCount".equals(element.getLocalName()))
								twitterMessage.setRetweetCount(new Integer(element.getTextContent()));
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "retweetedByMe".equals(element.getLocalName()))
								twitterMessage.setRetweetedByMe(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "source".equals(element.getLocalName()))
								twitterMessage.setSource(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "truncated".equals(element.getLocalName()))
								twitterMessage.setTruncated(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "tweetid".equals(element.getLocalName()))
								twitterMessage.setTweetid(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "url".equals(element.getLocalName()))
								twitterMessage.setUrl(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "userId".equals(element.getLocalName()))
								twitterMessage.setUserId(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "userName".equals(element.getLocalName()))
								twitterMessage.setUserName(element.getTextContent());
							if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
									&& "userScreenName".equals(element.getLocalName()))
								twitterMessage.setUserScreenName(element.getTextContent());
						}
					}
				}
			}
		}
		if (hasError) {
			responseJson.setResult("KO");
			responseJson.setMessage("Code: " + errorCode + " - Message: " + errorMessage);
			responseJson.setTwitterMessage(null);
		} else {
			responseJson.setResult("OK");
			responseJson.setMessage("Valid Query");
			responseJson.setTwitterMessage(twitterMessage);
		}
		return responseJson;
	}

	private String createXmlInput(TwitterQuery twitterQuery) {
		String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:twit=\"http://twitterpoller.yucca.csi.org\" xmlns:xsd=\"http://dto.twitterpoller.yucca.csi.org/xsd\">";
		xmlInput += "    <soapenv:Header/>";
		xmlInput += "    <soapenv:Body>";
		xmlInput += "        <twit:invokeTwitter>";
		xmlInput += "            <twit:twitterQuery>";
		if (twitterQuery.getTwtCount() != null)
			xmlInput += "                <xsd:twtCount>" + twitterQuery.getTwtCount() + "</xsd:twtCount>";
		if (twitterQuery.getTwtGeolocLat() != null)
			xmlInput += "                <xsd:twtGeolocLat>" + twitterQuery.getTwtGeolocLat() + "</xsd:twtGeolocLat>";
		if (twitterQuery.getTwtGeolocLon() != null)
			xmlInput += "                <xsd:twtGeolocLon>" + twitterQuery.getTwtGeolocLon() + "</xsd:twtGeolocLon>";
		if (twitterQuery.getTwtGeolocRadius() != null)
			xmlInput += "                <xsd:twtGeolocRadius>" + twitterQuery.getTwtGeolocRadius() + "</xsd:twtGeolocRadius>";
		if (twitterQuery.getTwtGeolocUnit() != null)
			xmlInput += "                <xsd:twtGeolocUnit>" + twitterQuery.getTwtGeolocUnit() + "</xsd:twtGeolocUnit>";
		if (twitterQuery.getTwtLang() != null)
			xmlInput += "                <xsd:twtLang>" + twitterQuery.getTwtLang() + "</xsd:twtLang>";
		if (twitterQuery.getTwtLastSearchId() != null)
			xmlInput += "                <xsd:twtLastSearchId>" + twitterQuery.getTwtLastSearchId() + "</xsd:twtLastSearchId>";
		if (twitterQuery.getTwtQuery() != null)
			xmlInput += "                <xsd:twtQuery>" + twitterQuery.getTwtQuery() + "</xsd:twtQuery>";
		if (twitterQuery.getTwtResultType() != null)
			xmlInput += "                <xsd:twtResultType>" + twitterQuery.getTwtResultType() + "</xsd:twtResultType>";
		if (twitterQuery.getTwtTokenSecret() != null)
			xmlInput += "                <xsd:twtTokenSecret>" + twitterQuery.getTwtTokenSecret() + "</xsd:twtTokenSecret>";
		if (twitterQuery.getTwtUntil() != null)
			xmlInput += "                <xsd:twtUntil>" + twitterQuery.getTwtUntil() + "</xsd:twtUntil>";
		if (twitterQuery.getTwtUserToken() != null)
			xmlInput += "                <xsd:twtUserToken>" + twitterQuery.getTwtUserToken() + "</xsd:twtUserToken>";
		xmlInput += "            </twit:twitterQuery>";
		xmlInput += "            <twit:streamInfo>";
		if (twitterQuery.getResetLastId() != null)
			xmlInput += "                <xsd:resetLastId>" + twitterQuery.getResetLastId() + "</xsd:resetLastId>";
		if (twitterQuery.getStreamCode() != null)
			xmlInput += "                <xsd:streamCode>" + twitterQuery.getStreamCode() + "</xsd:streamCode>";
		if (twitterQuery.getStreamVersion() != null)
			xmlInput += "                <xsd:streamVersion>" + twitterQuery.getStreamVersion() + "</xsd:streamVersion>";
		if (twitterQuery.getTenatcode() != null)
			xmlInput += "                <xsd:tenatcode>" + twitterQuery.getTenatcode() + "</xsd:tenatcode>";
		if (twitterQuery.getVirtualEntityCode() != null)
			xmlInput += "               <xsd:virtualEntityCode>" + twitterQuery.getVirtualEntityCode() + "</xsd:virtualEntityCode>";
		xmlInput += "            </twit:streamInfo>";
		xmlInput += "        </twit:invokeTwitter>";
		xmlInput += "    </soapenv:Body>";
		xmlInput += "</soapenv:Envelope>";
		return xmlInput;
	}

	private class ResponseJson {
		private String result;
		private String message;
		private TwitterMessage twitterMessage;

		public ResponseJson() {
			super();
		}

		@SuppressWarnings("unused")
		public ResponseJson(String result, String message, TwitterMessage twitterMessage) {
			super();
			this.result = result;
			this.message = message;
			this.setTwitterMessage(twitterMessage);
		}

		@SuppressWarnings("unused")
		public String getResult() {
			return result;
		}

		public void setResult(String result) {
			this.result = result;
		}

		@SuppressWarnings("unused")
		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

		public String toJson() {
			Gson gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).create();
			return gson.toJson(this);
		}

		@SuppressWarnings("unused")
		public TwitterMessage getTwitterMessage() {
			return twitterMessage;
		}

		public void setTwitterMessage(TwitterMessage twitterMessage) {
			this.twitterMessage = twitterMessage;
		}

	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	public static void main(String[] args) {

		// String xml =
		// "<?xml version=\"1.0\" encoding=\"utf-8\"?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body><ns:invokeTwitterResponse xmlns:ns=\"http://twitterpoller.yucca.csi.org\"><ns:return xsi:type=\"YuccaTwitterCepRecord\" xmlns:ax2574=\"http://dto.twitterpoller.yucca.csi.org/xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><errore xsi:nil=\"true\"/><sensor>CloodTwitter</sensor><stream>ClasStream3</stream><values><components><contributors xsi:nil=\"true\"/><createdAt>2015-07-14T16:46:17Z</createdAt><currentUserRetweetId>-1</currentUserRetweetId><favoriteCount>0</favoriteCount><favorited>false</favorited><getText>@google Complimenti x Plutone con sonda animazione azzeccata ! Bravi anche quando ricordate i natali di molti scienziati e personaggi</getText><hashTags xsi:nil=\"true\"/><lang>it</lang><lat>44.604801</lat><lon>8.5518689</lon><media xsi:nil=\"true\"/><mediaCnt xsi:nil=\"true\"/><mediaUrl xsi:nil=\"true\"/><placeName>Cassinelle, Piemonte (Italia-IT)</placeName><possiblySensitive>false</possiblySensitive><retweet>false</retweet><retweetCount>0</retweetCount><retweetedByMe>false</retweetedByMe><source>Twitter for Android</source><truncated>false</truncated><tweetid>620997757860466689</tweetid><url xsi:nil=\"true\"/></components><time>2015-07-14T16:46:17Z</time></values></ns:return></ns:invokeTwitterResponse></soapenv:Body></soapenv:Envelope>";

		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body><ns:invokeTwitterResponse xmlns:ns=\"http://twitterpoller.yucca.csi.org\">";
		xml += "<ns:return xsi:type=\"ax2576:YuccaTwitterCepRecord\" xmlns:ax2576=\"http://dto.twitterpoller.yucca.csi.org/xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><ax2576:errore xsi:nil=\"true\"/><ax2576:sensor>smartTweetInt</ax2576:sensor><ax2576:stream>smartTweetInt</ax2576:stream>"
				+ "<ax2576:values><ax2576:components><ax2576:contributors xsi:nil=\"true\"/><ax2576:createdAt>2015-07-20T08:36:53Z</ax2576:createdAt><ax2576:currentUserRetweetId>-1</ax2576:currentUserRetweetId><ax2576:favoriteCount>0</ax2576:favoriteCount><ax2576:favorited>false</ax2576:favorited><ax2576:getText>Reabren "
				+ "los bancos en Grecia pero se mantienen los controles de capital: EFE Desde este lunes se realizan oper... http://t.co/2ttn3V6ODP</ax2576:getText><ax2576:hashTags xsi:nil=\"true\"/>"
				+ "<ax2576:lang>es</ax2576:lang><ax2576:lat xsi:nil=\"true\"/><ax2576:lon xsi:nil=\"true\"/><ax2576:media xsi:nil=\"true\"/><ax2576:mediaCnt xsi:nil=\"true\"/><ax2576:mediaUrl xsi:nil=\"true\"/>"
				+ "<ax2576:placeName xsi:nil=\"true\"/><ax2576:possiblySensitive>false</ax2576:possiblySensitive><ax2576:retweet>false</ax2576:retweet><ax2576:retweetCount>0</ax2576:retweetCount><ax2576:retweetedByMe>"
				+ "false</ax2576:retweetedByMe><ax2576:source>&lt;a "
				+ "href=\"http://twitterfeed.com\" "
				+ "rel=\"nofollow\">twitterfeed&lt;/a></ax2576:source><ax2576:truncated>false</ax2576:truncated><ax2576:tweetid>"
				+ "623048922127204352</ax2576:tweetid><ax2576:url>http://t.co/2ttn3V6ODP</ax2576:url></ax2576:components><ax2576:time>2015-07-20T08:36:53Z</ax2576:time></ax2576:values></ns:return></ns:invokeTwitterResponse></soapenv:Body></soapenv:Envelope>";
		@SuppressWarnings("unused")
		String xmlError = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body><ns:invokeTwitterResponse xmlns:ns=\"http://twitterpoller.yucca.csi.org\"><ns:return xsi:type=\"YuccaTwitterCepRecord\" xmlns:ax2574=\"http://dto.twitterpoller.yucca.csi.org/xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><errore xsi:type=\"YuccaTwitterException\"><twtErrorCode>TWT_89</twtErrorCode><twtErrorMessage>Invalid or expired token.</twtErrorMessage></errore><sensor xsi:nil=\"true\"/><stream xsi:nil=\"true\"/><values xsi:nil=\"true\"/></ns:return></ns:invokeTwitterResponse></soapenv:Body></soapenv:Envelope>";
		try {

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			dbf.setNamespaceAware(true);

			DocumentBuilder db = dbf.newDocumentBuilder();

			Document doc = db.parse(new ByteArrayInputStream(xml.getBytes()));
			// Document doc = db.parse(new
			// ByteArrayInputStream(xmlError.getBytes()));

			TwitterMessage twitterMessage = new TwitterMessage();

			NodeList invokeTwitterResponse = doc.getElementsByTagNameNS("http://twitterpoller.yucca.csi.org", "invokeTwitterResponse");
			System.out.println(invokeTwitterResponse.item(0).getTextContent());

			String nodeName = doc.getFirstChild().getFirstChild().getFirstChild().getNodeName();
			System.out.println("nodeName " + nodeName);
			String errorCode = null;
			String errorMessage = null;
			boolean hasError = false;
			if (invokeTwitterResponse != null && invokeTwitterResponse.getLength() > 0) {
				for (int i = 0; i < invokeTwitterResponse.item(0).getFirstChild().getChildNodes().getLength(); i++) {
					Node item = invokeTwitterResponse.item(0).getFirstChild().getChildNodes().item(i);
					System.out.println("localname: " + item.getLocalName());
					if ("errore".equals(item.getLocalName())) {
						if (item.getChildNodes().getLength() > 0) {
							hasError = true;

							for (int j = 0; j < item.getChildNodes().getLength(); j++) {
								Node element = item.getChildNodes().item(j);
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "twtErrorCode".equals(element.getLocalName()))
									errorCode = element.getTextContent().trim();
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "twtErrorMessage".equals(element.getLocalName()))
									errorMessage = element.getTextContent().trim();
							}
						}
					}
					if ("values".equals(item.getLocalName())) {
						Node components = item.getFirstChild();
						if (components != null) {
							for (int j = 0; j < components.getChildNodes().getLength(); j++) {
								Node element = components.getChildNodes().item(j);
								System.out.println("name: " + element.getLocalName() + " - value: " + element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "contributors".equals(element.getLocalName()))
									twitterMessage.setContributors(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "createdAt".equals(element.getLocalName()))
									twitterMessage.setCreatedAt(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "currentUserRetweetId".equals(element.getLocalName()))
									twitterMessage.setCurrentUserRetweetId(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "favoriteCount".equals(element.getLocalName()))
									twitterMessage.setFavoriteCount(new Integer(element.getTextContent()));
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "favorited".equals(element.getLocalName()))
									twitterMessage.setFavorited(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "getText".equals(element.getLocalName()))
									twitterMessage.setGetText(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "hashTags".equals(element.getLocalName()))
									twitterMessage.setHashTags(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lang".equals(element.getLocalName()))
									twitterMessage.setLang(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lat".equals(element.getLocalName()))
									twitterMessage.setLat(new Double(element.getTextContent()));
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "lon".equals(element.getLocalName()))
									twitterMessage.setLon(new Double(element.getTextContent()));
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "media".equals(element.getLocalName()))
									twitterMessage.setMedia(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "mediaCnt".equals(element.getLocalName()))
									twitterMessage.setMediaCnt(new Integer(element.getTextContent()));
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "mediaUrl".equals(element.getLocalName()))
									twitterMessage.setMediaUrl(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "placeName".equals(element.getLocalName()))
									twitterMessage.setPlaceName(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "possiblySensitive".equals(element.getLocalName()))
									twitterMessage.setPossiblySensitive(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "retweet".equals(element.getLocalName()))
									twitterMessage.setRetweet(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "retweetCount".equals(element.getLocalName()))
									twitterMessage.setRetweetCount(new Integer(element.getTextContent()));
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "retweetedByMe".equals(element.getLocalName()))
									twitterMessage.setRetweetedByMe(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "source".equals(element.getLocalName()))
									twitterMessage.setSource(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "truncated".equals(element.getLocalName()))
									twitterMessage.setTruncated(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "tweetid".equals(element.getLocalName()))
									twitterMessage.setTweetid(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "url".equals(element.getLocalName()))
									twitterMessage.setUrl(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("") && "userId".equals(element.getLocalName()))
									twitterMessage.setUserId(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "userName".equals(element.getLocalName()))
									twitterMessage.setUserName(element.getTextContent());
								if (element.getTextContent() != null && !element.getTextContent().trim().equals("")
										&& "userScreenName".equals(element.getLocalName()))
									twitterMessage.setUserScreenName(element.getTextContent());

							}
						}
					}
				}

			}

			System.out.println(hasError);
			System.out.println(twitterMessage.toJson());
			System.out.println(errorCode);
			System.out.println(errorMessage);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
