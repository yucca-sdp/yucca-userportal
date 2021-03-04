/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class Bundles {
	private Long idBundles;
	private Integer maxdatasetnum;
	private Integer maxstreamsnum;
	private String hasstage;
	private Integer maxOdataResultperpage;
	private String zeppelin;

	public Bundles() {
		super();
	}

	public Long getIdBundles() {
		return idBundles;
	}

	public void setIdBundles(Long idBundles) {
		this.idBundles = idBundles;
	}

	public Integer getMaxdatasetnum() {
		return maxdatasetnum;
	}

	public void setMaxdatasetnum(Integer maxdatasetnum) {
		this.maxdatasetnum = maxdatasetnum;
	}

	public Integer getMaxstreamsnum() {
		return maxstreamsnum;
	}

	public void setMaxstreamsnum(Integer maxstreamsnum) {
		this.maxstreamsnum = maxstreamsnum;
	}

	public String getHasstage() {
		return hasstage;
	}

	public void setHasstage(String hasstage) {
		this.hasstage = hasstage;
	}

	public Integer getMaxOdataResultperpage() {
		return maxOdataResultperpage;
	}

	public void setMaxOdataResultperpage(Integer maxOdataResultperpage) {
		this.maxOdataResultperpage = maxOdataResultperpage;
	}

	public String getZeppelin() {
		return zeppelin;
	}

	public void setZeppelin(String zeppelin) {
		this.zeppelin = zeppelin;
	}

}
