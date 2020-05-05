/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class TenantStatus {
	private Long idTenantStatus; private String tenantstatuscode; private String description;

	public TenantStatus() {
		super();
	}

	public Long getIdTenantStatus() {
		return idTenantStatus;
	}

	public void setIdTenantStatus(Long idTenantStatus) {
		this.idTenantStatus = idTenantStatus;
	}

	public String getTenantstatuscode() {
		return tenantstatuscode;
	}

	public void setTenantstatuscode(String tenantstatuscode) {
		this.tenantstatuscode = tenantstatuscode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
