/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.info;

import java.util.LinkedList;
import java.util.List;

import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

public class Releasenotes {

	public static final String PREFIX_IMPROVEMENTS = "IMPROVEMENT";
	public static final String PREFIX_FIXES = "FIX";
	public static final String RELEASE_DATE = "RELEASE_DATE";

	private String version;
	private String lang;
	private String releasedate;
	private List<String> improvements;
	private List<String> fixes;

	public Releasenotes() {
		super();
	}

	public String toJson() {
		Gson gson = JSonHelper.getInstance();
		return gson.toJson(this);
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public List<String> getImprovements() {
		return improvements;
	}

	public void setImprovements(List<String> improvements) {
		this.improvements = improvements;
	}

	public List<String> getFixes() {
		return fixes;
	}

	public void setFixes(List<String> fixes) {
		this.fixes = fixes;
	}

	public void addImprovement(String improvement) {
		if (improvements == null)
			improvements = new LinkedList<String>();
		improvements.add(improvement);

	}

	public void addFix(String fix) {
		if (fixes == null)
			fixes = new LinkedList<String>();
		fixes.add(fix);
	}

	public String getReleasedate() {
		return releasedate;
	}

	public void setReleasedate(String releasedate) {
		this.releasedate = releasedate;
	}

}
