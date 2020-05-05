/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.statistics;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.csi.yucca.userportal.userportal.utils.json.IgnoredJSON;

public class StatisticsResponse {

	public static final String SUBTYPE_STREAM_DATASET = "streamDataset";
	public static final String SUBTYPE_DATASET = "dataset";
	public static final String VISIBILITY_PUBLIC = "public";
	public static final String VISIBILITY_PRIVATE = "private";

	private long totalStatisticRows;

	private int totalOrganizations;
	private int totalStreams;
	private int totalSmartobjects;

	private long totalData;
	private long yesterdayData;
	private long totalMeasures;
	private long yesterdayMeasures;
	private long totalPublicData;
	private long totalPrivateData;
	private long totalPublicMeasures;
	private long totalPrivateMeasures;
	private long yesterdayPublicData;
	private long yesterdayPrivateData;
	private long yesterdayPublicMeasures;
	private long yesterdayPrivateMeasures;
	private Map<String, Integer> organizations;
	@IgnoredJSON
	private List<String> smartobjects;
	@IgnoredJSON
	private List<String> streams;
	private Map<String, Integer> domains;
	private long lastUpdateMillis;

	@IgnoredJSON
	private List<String> datasetCodes;

	public StatisticsResponse() {
		super();
		totalStatisticRows = 0;
		totalData = 0;
		yesterdayData = 0;
		totalMeasures = 0;
		yesterdayMeasures = 0;
		totalPublicData = 0;
		totalPrivateData = 0;
		totalPublicMeasures = 0;
		totalPrivateMeasures = 0;
		yesterdayPublicData = 0;
		yesterdayPrivateData = 0;
		yesterdayPublicMeasures = 0;
		yesterdayPrivateMeasures = 0;
		organizations = new HashMap<String, Integer>();
		smartobjects = new LinkedList<String>();
		streams = new LinkedList<String>();
		datasetCodes = new LinkedList<String>();
		domains = new HashMap<String, Integer>();
	}

	public long getTotalData() {
		return totalData;
	}

	public long getYesterdayData() {
		return yesterdayData;
	}

	public long getTotalMeasures() {
		return totalMeasures;
	}

	public long getYesterdayMeasures() {
		return yesterdayMeasures;
	}

	public long getTotalPublicData() {
		return totalPublicData;
	}

	public long getTotalPrivateData() {
		return totalPrivateData;
	}

	public long getTotalPublicMeasures() {
		return totalPublicMeasures;
	}

	public long getTotalPrivateMeasures() {
		return totalPrivateMeasures;
	}

	public long getYesterdayPublicData() {
		return yesterdayPublicData;
	}

	public long getYesterdayPrivateData() {
		return yesterdayPrivateData;
	}

	public long getYesterdayPublicMeasures() {
		return yesterdayPublicMeasures;
	}

	public long getYesterdayPrivateMeasures() {
		return yesterdayPrivateMeasures;
	}

	public Map<String, Integer> getOrganizations() {
		return organizations;
	}

	public List<String> getSmartobjects() {
		return smartobjects;
	}

	public List<String> getStreams() {
		return streams;
	}

	public Map<String, Integer> getDomains() {
		return domains;
	}

	public int getTotalOrganizations() {
		return totalOrganizations;
	}

	public int getTotalSmartobjects() {
		return totalSmartobjects;
	}

	public int getTotalStreams() {
		return totalStreams;
	}

	public int getTotalDomains() {
		return domains.size();
	}

	public void addTotalData(String dataString, String subtype, String visibility) {
		int data = new Integer(dataString);
		this.totalData += data;
		if (SUBTYPE_STREAM_DATASET.equals(subtype))
			this.totalMeasures += data;

		if (VISIBILITY_PRIVATE.equals(visibility)) {
			this.totalPrivateData += data;
			if (SUBTYPE_STREAM_DATASET.equals(subtype))
				this.totalPrivateMeasures += data;
		} else if (VISIBILITY_PUBLIC.equals(visibility)) {
			this.totalPublicData += data;
			if (SUBTYPE_STREAM_DATASET.equals(subtype))
				this.totalPublicMeasures += data;
		}
	}

	public void addYesterdayData(String dataString, String subtype, String visibility) {
		int data = new Integer(dataString);
		this.yesterdayData += data;
		if (SUBTYPE_STREAM_DATASET.equals(subtype))
			this.yesterdayMeasures += data;

		if (VISIBILITY_PRIVATE.equals(visibility)) {
			this.yesterdayPrivateData += data;
			if (SUBTYPE_STREAM_DATASET.equals(subtype))
				this.yesterdayPrivateMeasures += data;
		} else if (VISIBILITY_PUBLIC.equals(visibility)) {
			this.yesterdayPublicData += data;
			if (SUBTYPE_STREAM_DATASET.equals(subtype))
				this.yesterdayPublicMeasures += data;
		}
	}

	public void addOrganization(String organization) {
		if (organization != null && !organization.equals("undefined")) {
			Integer count = organizations.get(organization);
			if (count == null)
				organizations.put(organization, 1);
			else
				organizations.put(organization, count + 1);
		}
	}

	public void addSmartobject(String smartobject) {
		if (smartobject != null && !smartobjects.contains(smartobject))
			smartobjects.add(smartobject);
	}

	public void addStream(String stream, String datasetCode) {
		if (stream != null && datasetCode != null && !datasetCodes.contains(datasetCode)){
			streams.add(stream);
			datasetCodes.add(datasetCode);
		}
	}

	public void addDomain(String domain) {
		if (domain != null && !domain.equals("undefined")) {
			Integer count = domains.get(domain);
			if (count == null)
				domains.put(domain, 1);
			else
				domains.put(domain, count + 1);
		}
	}

	public long getTotalStatisticRows() {
		return totalStatisticRows;
	}

	public void setTotalStatisticRows(int totalStatisticRows) {
		this.totalStatisticRows = totalStatisticRows;
	}

	public void incrementStatisticRowCounter() {
		this.totalStatisticRows++;

	}

	public long getLastUpdateMillis() {
		return lastUpdateMillis;
	}

	public void setLastUpdateMillis(long lastUpdateMillis) {
		this.lastUpdateMillis = lastUpdateMillis;
	}

	public void setTotalOrganizations(int totalOrganizations) {
		this.totalOrganizations = totalOrganizations;
	}

	public void setTotalStreams(int totalStreams) {
		this.totalStreams = totalStreams;
	}

	public void setTotalSmartobjects(int totalSmartobjects) {
		this.totalSmartobjects = totalSmartobjects;
	}

}
