/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.store;

public class GenerateTokenData {
	private GenerateTokenKey key;

	public GenerateTokenData() {
		super();
	}

	public GenerateTokenKey getKey() {
		return key;
	}

	public void setKey(GenerateTokenKey key) {
		this.key = key;
	}

}
