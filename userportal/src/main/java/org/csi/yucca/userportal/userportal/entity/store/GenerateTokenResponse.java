/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.store;

import com.google.gson.annotations.SerializedName;

public class GenerateTokenResponse {
	private boolean error;

	@SerializedName("data")
	private GenerateTokenData data;

	public GenerateTokenResponse() {
		super();
	}

	public boolean getError() {
		return error;
	}

	public void setError(boolean error) {
		this.error = error;
	}

	public GenerateTokenData getData() {
		return data;
	}

	public void setData(GenerateTokenData data) {
		this.data = data;
	}

}
