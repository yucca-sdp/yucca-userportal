/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.store;

public class GenerateTokenKey {
	private String accessToken;
	private String consumerKey;
	private String consumerSecret;
	private boolean enableRegenarate;
	private String validityTime;

	public GenerateTokenKey() {
		super();
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getConsumerKey() {
		return consumerKey;
	}

	public void setConsumerKey(String consumerKey) {
		this.consumerKey = consumerKey;
	}

	public String getConsumerSecret() {
		return consumerSecret;
	}

	public void setConsumerSecret(String consumerSecret) {
		this.consumerSecret = consumerSecret;
	}

	public boolean isEnableRegenarate() {
		return enableRegenarate;
	}

	public void setEnableRegenarate(boolean enableRegenarate) {
		this.enableRegenarate = enableRegenarate;
	}

	public String getValidityTime() {
		return validityTime;
	}

	public void setValidityTime(String validityTime) {
		this.validityTime = validityTime;
	}

}
