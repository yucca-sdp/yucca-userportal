/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class TenantType {
	private Long idTenantType;
	private String tenanttypecode;
	private String description;

	public TenantType() {
		super();
	}

	public Long getIdTenantType() {
		return idTenantType;
	}

	public void setIdTenantType(Long idTenantType) {
		this.idTenantType = idTenantType;
	}

	public String getTenanttypecode() {
		return tenanttypecode;
	}

	public void setTenanttypecode(String tenanttypecode) {
		this.tenanttypecode = tenanttypecode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
