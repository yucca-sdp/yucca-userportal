/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.twitter;

import org.csi.yucca.userportal.userportal.utils.json.GSONExclusionStrategy;
import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class TwitterQuery {

	private Integer twtCount;
	private Double twtGeolocLat;
	private Double twtGeolocLon;
	private Integer twtGeolocRadius;
	private String twtGeolocUnit;
	private String twtLang;
	private String twtLastSearchId;
	private String twtQuery;
	private String twtResultType;
	private String twtTokenSecret;
	private String twtUntil;
	private String twtUserToken;
	private String resetLastId;
	private String streamCode;
	private String streamVersion;
	private String tenatcode;
	private String virtualEntityCode;

	public TwitterQuery() {
		super();
	}

	public static TwitterQuery fromJson(String json) {
		Gson gson = JSonHelper.getInstance();
		return gson.fromJson(json, TwitterQuery.class);
	}

	public String toJson() {
		Gson gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).create();
		return gson.toJson(this);
	}

	public Integer getTwtCount() {
		return twtCount;
	}

	public void setTwtCount(Integer twtCount) {
		this.twtCount = twtCount;
	}

	public Double getTwtGeolocLat() {
		return twtGeolocLat;
	}

	public void setTwtGeolocLat(Double twtGeolocLat) {
		this.twtGeolocLat = twtGeolocLat;
	}

	public Double getTwtGeolocLon() {
		return twtGeolocLon;
	}

	public void setTwtGeolocLon(Double twtGeolocLon) {
		this.twtGeolocLon = twtGeolocLon;
	}

	public Integer getTwtGeolocRadius() {
		return twtGeolocRadius;
	}

	public void setTwtGeolocRadius(Integer twtGeolocRadius) {
		this.twtGeolocRadius = twtGeolocRadius;
	}

	public String getTwtGeolocUnit() {
		return twtGeolocUnit;
	}

	public void setTwtGeolocUnit(String twtGeolocUnit) {
		this.twtGeolocUnit = twtGeolocUnit;
	}

	public String getTwtLang() {
		return twtLang;
	}

	public void setTwtLang(String twtLang) {
		this.twtLang = twtLang;
	}

	public String getTwtLastSearchId() {
		return twtLastSearchId;
	}

	public void setTwtLastSearchId(String twtLastSearchId) {
		this.twtLastSearchId = twtLastSearchId;
	}

	public String getTwtQuery() {
		return twtQuery;
	}

	public void setTwtQuery(String twtQuery) {
		this.twtQuery = twtQuery;
	}

	public String getTwtResultType() {
		return twtResultType;
	}

	public void setTwtResultType(String twtResultType) {
		this.twtResultType = twtResultType;
	}

	public String getTwtTokenSecret() {
		return twtTokenSecret;
	}

	public void setTwtTokenSecret(String twtTokenSecret) {
		this.twtTokenSecret = twtTokenSecret;
	}

	public String getTwtUntil() {
		return twtUntil;
	}

	public void setTwtUntil(String twtUntil) {
		this.twtUntil = twtUntil;
	}

	public String getTwtUserToken() {
		return twtUserToken;
	}

	public void setTwtUserToken(String twtUserToken) {
		this.twtUserToken = twtUserToken;
	}

	public String getResetLastId() {
		return resetLastId;
	}

	public void setResetLastId(String resetLastId) {
		this.resetLastId = resetLastId;
	}

	public String getStreamCode() {
		return streamCode;
	}

	public void setStreamCode(String streamCode) {
		this.streamCode = streamCode;
	}

	public String getStreamVersion() {
		return streamVersion;
	}

	public void setStreamVersion(String streamVersion) {
		this.streamVersion = streamVersion;
	}

	public String getTenatcode() {
		return tenatcode;
	}

	public void setTenatcode(String tenatcode) {
		this.tenatcode = tenatcode;
	}

	public String getVirtualEntityCode() {
		return virtualEntityCode;
	}

	public void setVirtualEntityCode(String virtualEntityCode) {
		this.virtualEntityCode = virtualEntityCode;
	}

}
