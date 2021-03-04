/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class ShareType {
	private Long idShareType;
	private String description;

	public ShareType() {
		super();
	}

	public Long getIdShareType() {
		return idShareType;
	}

	public void setIdShareType(Long idShareType) {
		this.idShareType = idShareType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
