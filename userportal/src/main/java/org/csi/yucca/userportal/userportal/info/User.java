/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.info;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import net.minidev.json.JSONObject;

import org.csi.yucca.userportal.userportal.entity.admin.tenant.Tenant;
import org.csi.yucca.userportal.userportal.entity.store.LoadTokenFromApiResponse;
import org.csi.yucca.userportal.userportal.utils.json.IgnoredJSON;
import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

public class User {
	private String username;
	private List<Tenant> tenants;
	private String activeTenant;
	private String firstname;
	private String lastname;
	private String email;
	private boolean loggedIn;
	private List<String> permissions;
	private String token;
	private Map<String, String> tenantsTokens;
	private List<String> acceptTermConditionTenants;
	private String storeToken;

	private boolean isSocialUser;
	private boolean isTechnicalUser;
	private boolean isStrongUser;
	private String errorOnLogin;

	// fields starting with secret will not be serialized in json for client
	@IgnoredJSON
	private LoadTokenFromApiResponse secretTokenFromSaml;
	@IgnoredJSON
	private JSONObject secretTempJwt;

	@IgnoredJSON
	private String secretTempJwtRaw;

	public String getSecretTempJwtRaw() {
		return secretTempJwtRaw;
	}

	public void setSecretTempJwtRaw(String secretTempJwtRaw) {
		this.secretTempJwtRaw = secretTempJwtRaw;
	}

	public JSONObject getSecretTempJwt() {
		return secretTempJwt;
	}

	public User() {
	}

	public User(String username, List<Tenant> tenants, String firstname, String lastname, String email, List<String> permissions, List<String> acceptTermConditionTenants) {
		super();
		this.username = username;
		this.tenants = tenants;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.loggedIn = false;
		this.permissions = permissions;
		if (tenants.size() > 0) {
			this.activeTenant = tenants.get(0).getTenantcode();
		} else {
			this.activeTenant = "sandbox";
		}
		this.acceptTermConditionTenants = acceptTermConditionTenants;
		this.secretTokenFromSaml = null;
		this.secretTempJwt = null;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Tenant> getTenants() {
		return tenants;
	}

	public void setTenants(List<Tenant> tenants) {
		this.tenants = tenants;
	}

	public String toJson() {
		Gson gson = JSonHelper.getInstance();
		return gson.toJson(this);
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public boolean getLoggedIn() {
		return loggedIn;
	}

	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}

	public void addRole(String permission) {
		if (getPermissions() == null)
			setPermissions(new LinkedList<String>());
		getPermissions().add(permission);
	}

	public void removeRole(String permission) {
		if (getPermissions() != null) {
			getPermissions().remove(permission);
			if (getPermissions().size() == 0)
				setPermissions(null);
		}
	}

	public List<String> getPermissions() {
		return permissions;
	}

	public void setPermissions(List<String> permissions) {
		this.permissions = permissions;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getActiveTenant() {
		return activeTenant;
	}

	public void setActiveTenant(String activeTenant) {
		this.activeTenant = activeTenant;
	}

	public Map<String, String> getTenantsTokens() {
		return tenantsTokens;
	}

	public void setTenantsTokens(Map<String, String> tenantsTokens) {
		this.tenantsTokens = tenantsTokens;
	}

	public boolean hasTenant(String tenantCode) {
		boolean found = false;
		if (getTenants() != null && tenantCode != null) {
			for (Tenant tenant : getTenants()) {
				if (tenant.getTenantcode().equals(tenantCode)) {
					found = true;
					break;
				}
			}
		}
		return found;
	}

	public List<String> getAcceptTermConditionTenants() {
		return acceptTermConditionTenants;
	}

	public void setAcceptTermConditionTenants(List<String> acceptTermConditionTenants) {
		this.acceptTermConditionTenants = acceptTermConditionTenants;
	}

	public void addAcceptTermConditionTenants(String tenantCode) {
		if (this.acceptTermConditionTenants == null)
			this.acceptTermConditionTenants = new LinkedList<String>();
		if (tenantCode!=null && !tenantCode.trim().equals("") && !this.acceptTermConditionTenants.contains(tenantCode))
			this.acceptTermConditionTenants.add(tenantCode);
	}

	public void setAcceptTermConditionTenantsFromString(String tenants) {
		this.acceptTermConditionTenants = new LinkedList<String>();
		if (tenants != null) {
			for (String t : tenants.split("[|]")) {
				this.addAcceptTermConditionTenants(t);
			}

		}
	}

	public String getAcceptTermConditionTenantsString() {
		String result = "";
		if (this.acceptTermConditionTenants != null) {
			for (int i = 0; i < this.acceptTermConditionTenants.size(); i++) {
				result += this.acceptTermConditionTenants.get(i);
				if (i < this.acceptTermConditionTenants.size() - 1)
					result += "|";

			}

		}
		return result;
	}

	public String getStoreToken() {
		return storeToken;
	}

	public void setStoreToken(String storeToken) {
		this.storeToken = storeToken;
	}

	public LoadTokenFromApiResponse getSecretTokenFromSaml() {
		return secretTokenFromSaml;
	}

	public void setSecretTokenFromSaml(LoadTokenFromApiResponse secretTokenFromSaml) {
		this.secretTokenFromSaml = secretTokenFromSaml;
	}

	public void setSecretTempJwt(JSONObject jwt) {
		this.secretTempJwt = jwt;
	}

	public boolean isSocialUser() {
		return isSocialUser;
	}

	public void setSocialUser(boolean isSocialUser) {
		this.isSocialUser = isSocialUser;
	}

	public boolean isTechnicalUser() {
		return isTechnicalUser;
	}

	public void setTechnicalUser(boolean isTechnicalUser) {
		this.isTechnicalUser = isTechnicalUser;
	}

	public boolean isStrongUser() {
		return isStrongUser;
	}

	public void setStrongUser(boolean isStrongUser) {
		this.isStrongUser = isStrongUser;
	}

	public String getErrorOnLogin() {
		return errorOnLogin;
	}

	public void setErrorOnLogin(String errorOnLogin) {
		this.errorOnLogin = errorOnLogin;
	}

}
