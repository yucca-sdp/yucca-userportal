/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.store;

import java.util.List;

import com.google.gson.annotations.SerializedName;

public class ApplicationSubscription {
	private String callbackUrl;
	private long id;
	private String name;
	private String prodAuthorizedDomains;
	private String prodConsumerKey;
	private String prodConsumerSecret;
	private String prodKey;
	private boolean prodRegenarateOption;
	private long prodValidityTime;
	private boolean sandRegenarateOption;
	private long sandValidityTime;
	private String sandboxAuthorizedDomains;
	private String sandboxConsumerKey;
	private String sandboxConsumerSecret;
	private String sandboxKey;

	@SerializedName("subscriptions")
	private List<ApiSubscription> subscriptions;

	public ApplicationSubscription() {
		super();
	}

	public String getCallbackUrl() {
		return callbackUrl;
	}

	public void setCallbackUrl(String callbackUrl) {
		this.callbackUrl = callbackUrl;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public boolean isProdRegenarateOption() {
		return prodRegenarateOption;
	}

	public void setProdRegenarateOption(boolean prodRegenarateOption) {
		this.prodRegenarateOption = prodRegenarateOption;
	}

	public long getProdValidityTime() {
		return prodValidityTime;
	}

	public void setProdValidityTime(long prodValidityTime) {
		this.prodValidityTime = prodValidityTime;
	}

	public boolean isSandRegenarateOption() {
		return sandRegenarateOption;
	}

	public void setSandRegenarateOption(boolean sandRegenarateOption) {
		this.sandRegenarateOption = sandRegenarateOption;
	}

	public long getSandValidityTime() {
		return sandValidityTime;
	}

	public void setSandValidityTime(long sandValidityTime) {
		this.sandValidityTime = sandValidityTime;
	}

	public String getSandboxAuthorizedDomains() {
		return sandboxAuthorizedDomains;
	}

	public void setSandboxAuthorizedDomains(String sandboxAuthorizedDomains) {
		this.sandboxAuthorizedDomains = sandboxAuthorizedDomains;
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

	public List<ApiSubscription> getSubscriptions() {
		return subscriptions;
	}

	public void setSubscriptions(List<ApiSubscription> subscriptions) {
		this.subscriptions = subscriptions;
	}

}
