/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.statistics;

import com.google.gson.annotations.SerializedName;

public class StatisticsRow {

	@SerializedName("internalId")
	private String internalId;
	@SerializedName("Organizationcode")
	private String organizationCode;
	@SerializedName("Tenantcode")
	private String tenantCode;
	@SerializedName("Datasetcode")
	private String datasetCode;
	@SerializedName("Datadomain")
	private String dataDomain;
	@SerializedName("Codsubdomain")
	private String dataSubdomain;
	@SerializedName("Tipo")
	private String type;
	@SerializedName("Sottotipo")
	private String subtype;
	@SerializedName("Visibility")
	private String visibility;
	@SerializedName("Num_rows")
	private String numRows;
	@SerializedName("Num_bytes")
	private String numBytes;
	@SerializedName("Virtualentitycode")
	private String virtualentitycode;
	@SerializedName("Streamcode")
	private String streamcode;
	@SerializedName("Num_yesterday")
	private String numYesterday;
	@SerializedName("Elencoshare")
	private String shareList;
	@SerializedName("Deleted")
	private Boolean deleted;
	
	public StatisticsRow() {
		super();
	}

	public String getInternalId() {
		return internalId;
	}

	public void setInternalId(String internalId) {
		this.internalId = internalId;
	}

	public String getOrganizationCode() {
		return organizationCode;
	}

	public void setOrganizationCode(String organizationCode) {
		this.organizationCode = organizationCode;
	}

	public String getTenantCode() {
		return tenantCode;
	}

	public void setTenantCode(String tenantCode) {
		this.tenantCode = tenantCode;
	}

	public String getDatasetCode() {
		return datasetCode;
	}

	public void setDatasetCode(String datasetCode) {
		this.datasetCode = datasetCode;
	}

	public String getDataDomain() {
		return dataDomain;
	}

	public void setDataDomain(String dataDomain) {
		this.dataDomain = dataDomain;
	}

	public String getDataSubdomain() {
		return dataSubdomain;
	}

	public void setDataSubdomain(String dataSubdomain) {
		this.dataSubdomain = dataSubdomain;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSubtype() {
		return subtype;
	}

	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}

	public String getVisibility() {
		return visibility;
	}

	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}

	public String getNumRows() {
		return numRows == null ? "0" : numRows;
	}

	public void setNumRows(String numRows) {
		this.numRows = numRows == null ? "0" : numRows;
	}

	public String getNumBytes() {
		return numBytes == null ? "0" : numBytes;
	}

	public void setNumBytes(String numBytes) {
		this.numBytes = numBytes == null ? "0" : numBytes;
	}

	public String getVirtualentitycode() {
		return virtualentitycode;
	}

	public void setVirtualentitycode(String virtualentitycode) {
		this.virtualentitycode = virtualentitycode;
	}

	public String getStreamcode() {
		return streamcode;
	}

	public void setStreamcode(String streamcode) {
		this.streamcode = streamcode;
	}

	public String getNumYesterday() {
		return numYesterday == null ? "0" : numYesterday;
	}

	public void setNumYesterday(String numYesterday) {
		this.numYesterday = numYesterday == null ? "0" : numYesterday;
	}

	public String getShareList() {
		return shareList;
	}

	public void setShareList(String shareList) {
		this.shareList = shareList;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
