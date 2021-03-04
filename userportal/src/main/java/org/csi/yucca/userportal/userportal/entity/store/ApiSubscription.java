/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.store;

public class ApiSubscription {
	private String context;
	private String hasMultipleEndpoints;
	private String name;
	private String prodAuthorizedDomains;
	private String prodConsumerKey;
	private String prodConsumerSecret;
	private String prodKey;
	private Long prodValidityTime;
	private String provider;
	private String sandAuthorizedDomains;
	private Long sandValidityTime;
	private String sandboxConsumerKey;
	private String sandboxConsumerSecret;
	private String sandboxKey;
	private String status;
	private String subStatus;
	private String thumburl;
	private String tier;
	private String version;

	public ApiSubscription() {
		super();
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getHasMultipleEndpoints() {
		return hasMultipleEndpoints;
	}

	public void setHasMultipleEndpoints(String hasMultipleEndpoints) {
		this.hasMultipleEndpoints = hasMultipleEndpoints;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProdAuthorizedDomains() {
		return prodAuthorizedDomains;
	}

	public void setProdAuthorizedDomains(String prodAuthorizedDomains) {
		this.prodAuthorizedDomains = prodAuthorizedDomains;
	}

	public String getProdConsumerKey() {
		return prodConsumerKey;
	}

	public void setProdConsumerKey(String prodConsumerKey) {
		this.prodConsumerKey = prodConsumerKey;
	}

	public String getProdConsumerSecret() {
		return prodConsumerSecret;
	}

	public void setProdConsumerSecret(String prodConsumerSecret) {
		this.prodConsumerSecret = prodConsumerSecret;
	}

	public String getProdKey() {
		return prodKey;
	}

	public void setProdKey(String prodKey) {
		this.prodKey = prodKey;
	}

	public Long getProdValidityTime() {
		return prodValidityTime;
	}

	public void setProdValidityTime(Long prodValidityTime) {
		this.prodValidityTime = prodValidityTime;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getSandAuthorizedDomains() {
		return sandAuthorizedDomains;
	}

	public void setSandAuthorizedDomains(String sandAuthorizedDomains) {
		this.sandAuthorizedDomains = sandAuthorizedDomains;
	}

	public Long getSandValidityTime() {
		return sandValidityTime;
	}

	public void setSandValidityTime(Long sandValidityTime) {
		this.sandValidityTime = sandValidityTime;
	}

	public String getSandboxConsumerKey() {
		return sandboxConsumerKey;
	}

	public void setSandboxConsumerKey(String sandboxConsumerKey) {
		this.sandboxConsumerKey = sandboxConsumerKey;
	}

	public String getSandboxConsumerSecret() {
		return sandboxConsumerSecret;
	}

	public void setSandboxConsumerSecret(String sandboxConsumerSecret) {
		this.sandboxConsumerSecret = sandboxConsumerSecret;
	}

	public String getSandboxKey() {
		return sandboxKey;
	}

	public void setSandboxKey(String sandboxKey) {
		this.sandboxKey = sandboxKey;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSubStatus() {
		return subStatus;
	}

	public void setSubStatus(String subStatus) {
		this.subStatus = subStatus;
	}

	public String getThumburl() {
		return thumburl;
	}

	public void setThumburl(String thumburl) {
		this.thumburl = thumburl;
	}

	public String getTier() {
		return tier;
	}

	public void setTier(String tier) {
		this.tier = tier;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

}
