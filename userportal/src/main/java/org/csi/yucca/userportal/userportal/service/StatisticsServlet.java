/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.statistics.OdataResponse;
import org.csi.yucca.userportal.userportal.entity.statistics.StatisticsResponse;
import org.csi.yucca.userportal.userportal.entity.statistics.StatisticsRow;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/statistic" }, asyncSupported = true)
public class StatisticsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(StatisticsServlet.class);

	private static final long CACHE_TIME_TO_LIVE = 1000 * 60 * 60 * 12;
	private static long lastLoad = System.currentTimeMillis();
	private static String statisticJson;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[StatisticsServlet::doGet] - START");
		try {

			if (System.currentTimeMillis() - lastLoad > CACHE_TIME_TO_LIVE) {

				statisticJson = null;
				lastLoad = System.currentTimeMillis();
			}

			if (request.getParameter("clearCache") != null) {
				statisticJson = null;
				lastLoad = System.currentTimeMillis();
			}

			if (statisticJson == null) {

				Properties config = Config.loadServerConfiguration();
				String statisticDatasetCode = config.getProperty(Config.STATISTICS_DATASET_CODE);
				String baseODataUrl = config.getProperty(Config.API_ODATA_URL_KEY);
				String statisticAuthToken = Config.loadAuthorizationConfiguration().getProperty(Config.STATISTICS_AUTH_TOKEN);
				// FIXME remove
				baseODataUrl = "http://api.smartdatanet.it/api";
				HttpClient httpclient = new HttpClient();
				StatisticsResponse statisticsResponse = new StatisticsResponse();

				boolean loadOtherResults = true;
				int counter = 0;
				int page = 500;
				while (loadOtherResults && counter < 50) {
					loadOtherResults = loadStatistics(statisticsResponse, httpclient, baseODataUrl, statisticDatasetCode, statisticAuthToken, page,  counter * page);
					counter++;
				}

				statisticsResponse.setTotalOrganizations(statisticsResponse.getOrganizations().size());
				statisticsResponse.setTotalStreams(statisticsResponse.getStreams().size());
				statisticsResponse.setTotalSmartobjects(statisticsResponse.getSmartobjects().size());

				Gson gson  = JSonHelper.getInstance();
				statisticJson = gson.toJson(statisticsResponse);
			}

			String result = isJSONPRequest(request)?getCallbackMethod(request) + "(" + statisticJson + ")":statisticJson;
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");


			PrintWriter out = response.getWriter();
			out.println(result);
			out.close();

		} catch (IOException e) {
			log.error("[StatisticsServlet::doGet] - ERROR IOException " + e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("[StatisticsServlet::doGet] - ERROR Exception " + e.getMessage());
			throw new ServletException(e.getMessage());
		} finally {
			log.debug("[StatisticsServlet::doGet] - END");
		}
	}

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	private boolean loadStatistics(StatisticsResponse statisticsResponse, HttpClient httpclient, String baseODataUrl, String statisticDatasetCode, String statisticAuthToken, int page,
			int skip) throws IOException {

		String statisticsUrl = baseODataUrl + "/" + statisticDatasetCode + "/DataEntities?$format=json&$top="+page+"&$skip=" + skip + "&$orderby=internalId";

		GetMethod getMethod = new GetMethod(statisticsUrl);

		getMethod.setRequestHeader("Authorization", "Bearer " + statisticAuthToken);

		httpclient.executeMethod(getMethod);

		byte[] responsBytes = getMethod.getResponseBody();

		String jsonOdata = new String(responsBytes, "UTF-8");

		Gson gson = JSonHelper.getInstance();

		OdataResponse odataResponse = gson.fromJson(jsonOdata, OdataResponse.class);

		int totalRows = 0;
		if (odataResponse != null && odataResponse.getD() != null && odataResponse.getD().getResults() != null && odataResponse.getD().getResults().size() > 0) {
			for (StatisticsRow row : odataResponse.getD().getResults()) {

				if (statisticsResponse.getLastUpdateMillis() == 0) {
					long lastUpdateMillis = Long.parseLong(row.getInternalId().substring(0, 8), 16) * 1000;
					statisticsResponse.setLastUpdateMillis(lastUpdateMillis);
				}

				totalRows++;
				statisticsResponse.incrementStatisticRowCounter();
				statisticsResponse.addTotalData(row.getNumRows(), row.getSubtype(), row.getVisibility());
				statisticsResponse.addYesterdayData(row.getNumYesterday(), row.getSubtype(), row.getVisibility());
				statisticsResponse.addDomain(row.getDataDomain());
				statisticsResponse.addOrganization(row.getOrganizationCode());
				if(row.getDeleted()==null || !row.getDeleted())
					statisticsResponse.addStream(row.getStreamcode(), row.getDatasetCode());
				
				statisticsResponse.addSmartobject(row.getVirtualentitycode());
				
				log.debug("[StatisticsServlet::loadStatistics] org " +row.getOrganizationCode() + " - " + statisticsResponse.getOrganizations().size());
			}
		} 
		//
		return totalRows == page;

	}

	public static void main(String[] args) {
		String mongoId = "59b876fa7f3aad3ced192af2";
		long millis = Long.parseLong(mongoId.substring(0, 8), 16) * 1000;
		System.out.println("millis  " + mongoId.substring(0, 4) + " " + millis);
		System.out.println("date  " + new Date(millis));
	}
}
