/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.twitter;

import org.csi.yucca.userportal.userportal.utils.json.GSONExclusionStrategy;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class TwitterMessage {
	private String contributors;
	private String createdAt;
	private String currentUserRetweetId;
	private Integer favoriteCount;
	private String favorited;
	private String getText;
	private String hashTags;
	private String lang;
	private Double lat;
	private Double lon;
	private String media;
	private Integer mediaCnt;
	private String mediaUrl;
	private String placeName;
	private String possiblySensitive;
	private String retweet;
	private Integer retweetCount;
	private String retweetedByMe;
	private String source;
	private String truncated;
	private String tweetid;
	private String url;
	private String userId;
	private String userName;
	private String userScreenName;

	public TwitterMessage() {
		super();
	}

	public String toJson() {
		Gson gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).create();
		return gson.toJson(this);
	}

	public String getContributors() {
		return contributors;
	}

	public void setContributors(String contributors) {
		this.contributors = contributors;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public String getCurrentUserRetweetId() {
		return currentUserRetweetId;
	}

	public void setCurrentUserRetweetId(String currentUserRetweetId) {
		this.currentUserRetweetId = currentUserRetweetId;
	}

	public Integer getFavoriteCount() {
		return favoriteCount;
	}

	public void setFavoriteCount(Integer favoriteCount) {
		this.favoriteCount = favoriteCount;
	}

	public String getFavorited() {
		return favorited;
	}

	public void setFavorited(String favorited) {
		this.favorited = favorited;
	}

	public String getGetText() {
		return getText;
	}

	public void setGetText(String getText) {
		this.getText = getText;
	}

	public String getHashTags() {
		return hashTags;
	}

	public void setHashTags(String hashTags) {
		this.hashTags = hashTags;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public Double getLat() {
		return lat;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}

	public Double getLon() {
		return lon;
	}

	public void setLon(Double lon) {
		this.lon = lon;
	}

	public String getMedia() {
		return media;
	}

	public void setMedia(String media) {
		this.media = media;
	}

	public Integer getMediaCnt() {
		return mediaCnt;
	}

	public void setMediaCnt(Integer mediaCnt) {
		this.mediaCnt = mediaCnt;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}

	public String getPlaceName() {
		return placeName;
	}

	public void setPlaceName(String placeName) {
		this.placeName = placeName;
	}

	public String getPossiblySensitive() {
		return possiblySensitive;
	}

	public void setPossiblySensitive(String possiblySensitive) {
		this.possiblySensitive = possiblySensitive;
	}

	public String getRetweet() {
		return retweet;
	}

	public void setRetweet(String retweet) {
		this.retweet = retweet;
	}

	public Integer getRetweetCount() {
		return retweetCount;
	}

	public void setRetweetCount(Integer retweetCount) {
		this.retweetCount = retweetCount;
	}

	public String getRetweetedByMe() {
		return retweetedByMe;
	}

	public void setRetweetedByMe(String retweetedByMe) {
		this.retweetedByMe = retweetedByMe;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getTruncated() {
		return truncated;
	}

	public void setTruncated(String truncated) {
		this.truncated = truncated;
	}

	public String getTweetid() {
		return tweetid;
	}

	public void setTweetid(String tweetid) {
		this.tweetid = tweetid;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserScreenName() {
		return userScreenName;
	}

	public void setUserScreenName(String userScreenName) {
		this.userScreenName = userScreenName;
	}

}
