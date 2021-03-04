/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.backoffice.info;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.csi.yucca.userportal.backoffice.utils.AuthorizeUtils;
import org.csi.yucca.userportal.backoffice.utils.Config;

public enum ApiEntityEnum {

	API_INFO("API_INFO_URL", "/api/info") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_FABRIC_PROXY_URL("API_FABRIC_PROXY_URL", Config.API_PROXY_FABRIC_BASE_URL ) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_DEPLOY_PROXY_URL("API_DEPLOY_PROXY_URL", Config.API_PROXY_DEPLOY_BASE_URL ) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	//20171023 - Nuove API
	API_ADMIN_TENANTS("API_ADMIN_TENANTS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/tenants") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_ORGANIZATIONS("API_ADMIN_ORGANIZATIONS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/organizations") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_DOMAINS("API_ADMIN_DOMAINS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/domains") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_TAGS("API_ADMIN_TAGS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/tags") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_SUBDOMAINS("API_ADMIN_SUBDOMAINS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/subdomains") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_ORGANIZATIONS_IMPORT("API_ADMIN_ORGANIZATIONS_IMPORT_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/organizations") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_TENANTTYPES("API_ADMIN_TENANTTYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/tenant_types") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_DATASETS("API_ADMIN_DATASETS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/datasets") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_STREAMS("API_ADMIN_STREAMS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/streams") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	API_ADMIN_STREAM("API_ADMIN_STREAM_UPDATE_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/organizations/{organizationCode}/smartobjects/{soCode}/streams") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_ADMIN_TENANT_MAIL("API_ADMIN_TENANT_MAIL_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/mail") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_DATASOURCEGROUPS("API_ADMIN_DATASOURCEGROUPS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/organizations/{organizationCode}/datasourcegroups") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_DATASETS_BY_GROUPS("API_ADMIN_DATASETS_BY_GROUPS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/datasets/groupId={groupId}/groupVersion={groupVersion}") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_DATASET("API_ADMIN_DATASET_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/organizations/{organizationCode}/datasets") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_ACTION_ON_OOZIE("API_ADMIN_ACTION_ON_OOZIE_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/jobs/action") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_INFO_ON_OOZIE("API_ADMIN_INFO_ON_OOZIE_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/backoffice/jobs/showinfo") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	;

	private String nameEntity;
	private String baseUrl;

	private ApiEntityEnum(String nameEntity, String baseUrl) {
		this.nameEntity = nameEntity;
		this.baseUrl = baseUrl;
	}

	public abstract boolean isAuthorizeAccess(HttpServletRequest request);

	public void addPropertyForJs(String contextPath, Properties prop) {
		prop.put(nameEntity, contextPath + baseUrl);
	}

	public boolean isApiCalled(HttpServletRequest request) {
		String requestURI = request.getRequestURI();
		return (requestURI).startsWith(request.getContextPath() + baseUrl);
	}
}
