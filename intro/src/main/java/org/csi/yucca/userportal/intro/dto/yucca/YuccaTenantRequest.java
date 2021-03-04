/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.dto.yucca;

public class YuccaTenantRequest {
	private String recaptcha;
	private YuccaTenantRequestFormData data;

	public String getRecaptcha() {
		return recaptcha;
	}

	public void setRecaptcha(String recaptcha) {
		this.recaptcha = recaptcha;
	}

	public YuccaTenantRequestFormData getData() {
		return data;
	}

	public void setData(YuccaTenantRequestFormData data) {
		this.data = data;
	}

}