/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.twitter;

import org.csi.yucca.userportal.userportal.utils.json.GSONExclusionStrategy;
import org.csi.yucca.userportal.userportal.utils.json.IgnoredJSON;

import twitter4j.User;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class TwitterUser {

	@IgnoredJSON
	private User twitterUser;
	private String twtUsername;
	private String twtMaxserachNumber;
	private String twtMaxsearchInterval;
	private String twtUsertoken;
	private String twtTokenSecret;
	private String twtName;
	private Long twtIdUser;
	private String twtMiniProfileImageURLHttps;

	public TwitterUser() {
		super();
	}

	public TwitterUser(User twitterUser, String twtUsertoken, String twtTokenSecret) {
		super();
		this.twitterUser = twitterUser;
		this.twtUsertoken = twtUsertoken;
		this.twtTokenSecret = twtTokenSecret;
		if (twitterUser != null) {
			setTwtUsername(twitterUser.getScreenName());
			setTwtName(twitterUser.getName());
			setTwtIdUser(twitterUser.getId());
			setTwtMiniProfileImageURLHttps(twitterUser.getMiniProfileImageURLHttps());
		}
	}

	public User getTwitterUser() {
		return twitterUser;
	}

	public void setTwitterUser(User twitterUser) {
		this.twitterUser = twitterUser;
	}

	public String getTwtUsername() {
		return twtUsername;
	}

	public void setTwtUsername(String twtUsername) {
		this.twtUsername = twtUsername;
	}

	public String getTwtMaxserachNumber() {
		return twtMaxserachNumber;
	}

	public void setTwtMaxserachNumber(String twtMaxserachNumber) {
		this.twtMaxserachNumber = twtMaxserachNumber;
	}

	public String getTwtMaxsearchInterval() {
		return twtMaxsearchInterval;
	}

	public void setTwtMaxsearchInterval(String twtMaxsearchInterval) {
		this.twtMaxsearchInterval = twtMaxsearchInterval;
	}

	public String getTwtUsertoken() {
		return twtUsertoken;
	}

	public void setTwtUsertoken(String twtUsertoken) {
		this.twtUsertoken = twtUsertoken;
	}

	public String getTwtTokenSecret() {
		return twtTokenSecret;
	}

	public void setTwtTokenSecret(String twtTokenSecret) {
		this.twtTokenSecret = twtTokenSecret;
	}

	public String getTwtName() {
		return twtName;
	}

	public void setTwtName(String twtName) {
		this.twtName = twtName;
	}
	
	public Long getTwtIdUser() {
		return twtIdUser;
	}
	
	public void setTwtIdUser(Long twtIdUser) {
		this.twtIdUser = twtIdUser;
	}

	public String toJson() {
		Gson gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).create();
		return gson.toJson(this);
	}

	public String getTwtMiniProfileImageURLHttps() {
		return twtMiniProfileImageURLHttps;
	}

	public void setTwtMiniProfileImageURLHttps(String twtMiniProfileImageURLHttps) {
		this.twtMiniProfileImageURLHttps = twtMiniProfileImageURLHttps;
	}

}
