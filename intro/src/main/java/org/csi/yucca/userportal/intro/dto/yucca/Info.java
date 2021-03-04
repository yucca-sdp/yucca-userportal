/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.dto.yucca;



import org.csi.yucca.userportal.intro.utils.JSonHelper;

import com.google.gson.Gson;

public class Info {

	// private String tenantCode;
	private User user;
	private String version;

	public String toJson() {
		Gson gson = JSonHelper.getInstance();
		return gson.toJson(this);
	}

	public Info() {
		version = "2.1.3";
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getVersion() {
		return version; // FIXME manage version
	}

	public void setVersion(String version) {
		this.version = version;
	}


	// public String getTenantCode() {
	// return tenantCode;
	// }
	//
	// public void setTenantCode(String tenantCode) {
	// this.tenantCode = tenantCode;
	// }

}
