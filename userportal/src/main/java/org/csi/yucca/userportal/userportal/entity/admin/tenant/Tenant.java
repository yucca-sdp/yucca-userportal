/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.entity.admin.tenant;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.csi.yucca.userportal.userportal.utils.json.IgnoredJSON;

public class Tenant {

	private Bundles bundles;
	private String description;
	private Ecosystem ecosystem;
	private Long idTenant;
	private String name;
	private Organization organization;
	private ShareType shareType;
	private TenantStatus tenantStatus;
	private TenantType tenantType;
	private String tenantcode;
	private Integer usagedaysnumber;
	private String useremail;
	private String userfirstname;
	private String userlastname;
	private String username;
	private String usertypeauth;
	private String activationdate;
	private String deactivationdate;

	@IgnoredJSON
	private SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

	public Tenant() {
		super();
	}

	public Bundles getBundles() {
		return bundles;
	}

	public void setBundles(Bundles bundles) {
		this.bundles = bundles;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Ecosystem getEcosystem() {
		return ecosystem;
	}

	public void setEcosystem(Ecosystem ecosystem) {
		this.ecosystem = ecosystem;
	}

	public Long getIdTenant() {
		return idTenant;
	}

	public void setIdTenant(Long idTenant) {
		this.idTenant = idTenant;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public ShareType getShareType() {
		return shareType;
	}

	public void setShareType(ShareType shareType) {
		this.shareType = shareType;
	}

	public TenantStatus getTenantStatus() {
		return tenantStatus;
	}

	public void setTenantStatus(TenantStatus tenantStatus) {
		this.tenantStatus = tenantStatus;
	}

	public TenantType getTenantType() {
		return tenantType;
	}

	public void setTenantType(TenantType tenantType) {
		this.tenantType = tenantType;
	}

	public String getTenantcode() {
		return tenantcode;
	}

	public void setTenantcode(String tenantcode) {
		this.tenantcode = tenantcode;
	}

	public Integer getUsagedaysnumber() {
		return usagedaysnumber;
	}

	public void setUsagedaysnumber(Integer usagedaysnumber) {
		this.usagedaysnumber = usagedaysnumber;
	}

	public String getUseremail() {
		return useremail;
	}

	public void setUseremail(String useremail) {
		this.useremail = useremail;
	}

	public String getUserfirstname() {
		return userfirstname;
	}

	public void setUserfirstname(String userfirstname) {
		this.userfirstname = userfirstname;
	}

	public String getUserlastname() {
		return userlastname;
	}

	public void setUserlastname(String userlastname) {
		this.userlastname = userlastname;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsertypeauth() {
		return usertypeauth;
	}

	public void setUsertypeauth(String usertypeauth) {
		this.usertypeauth = usertypeauth;
	}

	public String getActivationdate() {
		return activationdate;
	}

	public void setActivationdate(String activationdate) {
		this.activationdate = activationdate;
	}

	public String getDeactivationdate() {
		return deactivationdate;
	}

	public void setDeactivationdate(String deactivationdate) {
		this.deactivationdate = deactivationdate;
	}

	public Date getActivationdateDate() throws ParseException {
		if (activationdate != null) {
			return formatter.parse(activationdate);
		}
		return null;
	}

	public Date getDeactivationdateDate() throws ParseException {
		if (deactivationdate != null) {
			return formatter.parse(deactivationdate);
		}
		return null;
	}

	public static final Tenant SANDBOX() {
		Tenant sandbox = new Tenant();
		sandbox.setIdTenant(3L);

		sandbox.setName("sanbox");
		sandbox.setDescription("sanbox");
		sandbox.setTenantcode("sandbox");
		sandbox.setUsagedaysnumber(-1);
		sandbox.setUsername("");
		sandbox.setUserfirstname("");
		sandbox.setUserlastname("");
		sandbox.setUsertypeauth("");

		Bundles sandboxBundles = new Bundles();
		sandboxBundles.setMaxstreamsnum(-1);
		sandboxBundles.setMaxdatasetnum(-1);
		sandbox.setBundles(sandboxBundles);

		TenantType sandboxTenantType = new TenantType();
		sandboxTenantType.setIdTenantType(-1L);
		sandboxTenantType.setDescription("readonly");
		sandboxTenantType.setTenanttypecode("readonly");
		sandbox.setTenantType(sandboxTenantType);

		TenantStatus sandboxTenantStatus = new TenantStatus();
		sandboxTenantStatus.setIdTenantStatus(2L);
		sandboxTenantStatus.setTenantstatuscode("inst");
		sandboxTenantStatus.setDescription("installed");
		sandbox.setTenantStatus(sandboxTenantStatus);

		Ecosystem sandboxEcosystem = new Ecosystem();
		sandboxEcosystem.setIdEcosystem(1L);
		sandboxEcosystem.setEcosystemcode("SDNET");
		sandboxEcosystem.setDescription("SDNET");
		sandbox.setEcosystem(sandboxEcosystem);

		Organization sandobxOrganization = new Organization();
		sandobxOrganization.setIdOrganization(-1L);
		sandobxOrganization.setOrganizationcode("SANDBOX");
		sandobxOrganization.setDescription("SANDBOX");
		sandbox.setOrganization(sandobxOrganization);

		ShareType sandboxShareType = new ShareType();
		sandboxShareType.setIdShareType(2L);
		sandboxShareType.setDescription("public");
		sandbox.setShareType(sandboxShareType);

		return sandbox;
	}
}
