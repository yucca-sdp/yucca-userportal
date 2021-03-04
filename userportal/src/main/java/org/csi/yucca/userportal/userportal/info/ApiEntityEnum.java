/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.info;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.entity.admin.tenant.Tenant;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

public enum ApiEntityEnum {

	API_INFO("API_INFO_URL", "/api/info") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_RELEASENOTES("API_RELEASENOTES_URL", "/api/releasenotes") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_STATISTICS("API_STATISTICS_URL", "/api/statistic") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_AUTH_TERMCONDITION("API_AUTH_TERMCONDITION_URL", "/api/termcondition") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_AUTH_UPDATE_USER_INFO("API_AUTH_UPDATE_USER_INFO_URL", "/api/updateUserInfo") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	// SERVICES
	API_SERVICES_STREAM_COMPONENT("API_SERVICES_STREAM_COMPONENT_URL", Config.API_PROXY_SERVICES_BASE_URL + "streams/components/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
		}
	},
	API_SERVICES_STREAM("API_SERVICES_STREAM_URL", Config.API_PROXY_SERVICES_BASE_URL + "streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			String visibleFromParm = request.getParameter("visibleFrom");

			if (AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(info.getUser().getActiveTenant())) {
				return true;
			}

			if (AuthorizeUtils.isReadMethod(request)) {
				return visibleFromIsSimilarToInfo(visibleFromParm, info);
			}

			return false;
		}

	},
	// @Deprecated
	// API_SERVICES_VIRTUALENTITY("API_SERVICES_VIRTUALENTITY_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "virtualentities/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	//
	// Info info = (Info)
	// request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
	// if (AuthorizeUtils.getElementInPositionByRequest(request,
	// 2).equals(info.getUser().getActiveTenant())) {
	// return true;
	// }
	// return false;
	// }
	// },
	API_SERVICES_TWITTER_AUTH_URL("API_SERVICES_TWITTER_AUTH_URL", Config.API_PROXY_SERVICES_TWITTER_BASE_URL + "auth") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			// Info info = (Info)
			// request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			// if (AuthorizeUtils.getElementInPositionByRequest(request,
			// 2).equals(info.getUser().getActiveTenant())) {
			// return true;
			// }
			// return false;
			return true;
		}
	},
	API_SERVICES_TWITTER_USER_URL("API_SERVICES_TWITTER_USER_URL", Config.API_PROXY_SERVICES_TWITTER_BASE_URL + "user") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			// Info info = (Info)
			// request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			// if (AuthorizeUtils.getElementInPositionByRequest(request,
			// 2).equals(info.getUser().getActiveTenant())) {
			// return true;
			// }
			// return false;
			return true;
		}
	},
	API_SERVICES_TWITTER_QUERY_URL("API_SERVICES_TWITTER_QUERY_URL", Config.API_PROXY_SERVICES_TWITTER_BASE_URL + "query") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			// Info info = (Info)
			// request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			// if (AuthorizeUtils.getElementInPositionByRequest(request,
			// 2).equals(info.getUser().getActiveTenant())) {
			// return true;
			// }
			// return false;
			return true;
		}
	},

	API_ADMIN_DATA_TYPES("API_ADMIN_DATA_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/data_types") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_DATASET_SUBTYPES("API_ADMIN_DATASET_SUBTYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/dataset_subtypes") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_DATASET_TYPES("API_ADMIN_DATASET_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/dataset_types") {
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
	API_ADMIN_ECOSYSTEMS("API_ADMIN_ECOSYSTEMS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/ecosystems") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_EXPOSURE_TYPES("API_ADMIN_EXPOSURE_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/exposure_types") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_LICENSES("API_ADMIN_LICENSES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/licenses") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_LOCATION_TYPES("API_ADMIN_LOCATION_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/location_types") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_MEASURE_UNITS("API_ADMIN_MEASURE_UNITS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/measure_units") {
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
	API_ADMIN_PHENOMENONS("API_ADMIN_PHENOMENONS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/phenomenons") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_SO_CATEGORIES("API_ADMIN_SO_CATEGORIES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/so_categories") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_ADMIN_SO_TYPES("API_ADMIN_SO_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/so_types") {
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
	API_ADMIN_SUPPLY_TYPES("API_ADMIN_SUPPLY_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/supply_types") {
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

	API_ADMIN_TENANTS("API_ADMIN_TENANTS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/tenants") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_ADMIN_SMARTOBJECTS("API_ADMIN_SMARTOBJECTS_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/smartobjects") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_ADMIN_STREAMS("API_ADMIN_STREAM_UPDATE_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/smartobjects/{soCode}/streams") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_ADMIN_STREAM("API_ADMIN_STREAM_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/streams") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_STREAM_LIFECYCLE("API_ADMIN_STREAM_LIFECYCLE_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/smartobjects/{soCode}/streams/{idStream}/action") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_VALIDATION_INTERNAL_STREAM_QUERY("API_ADMIN_VALIDATION_INTERNAL_STREAM_QUERY_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/validate/internalStream/query") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	// @Deprecated
	// API_SERVICES_VIRTUALENTITY_CATEGORIES("API_SERVICES_VIRTUALENTITY_CATEGORIES_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "misc/category/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// return false;// AuthorizeUtils.isReadMethod(request);
	// }
	// },
	// @Deprecated
	// API_SERVICES_VIRTUALENTITY_TYPES("API_SERVICES_VIRTUALENTITY_TYPES_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "misc/types/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// return AuthorizeUtils.isReadMethod(request);
	// }
	// },
	// @Deprecated
	// API_SERVICES_STREAM_TAGS("API_SERVICES_STREAM_TAGS_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "misc/streamtags/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// return AuthorizeUtils.isReadMethod(request);
	// }
	// },
	// @Deprecated
	// API_SERVICES_STREAM_DOMAINS("API_SERVICES_STREAM_DOMAINS_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "misc/streamdomains/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// return AuthorizeUtils.isReadMethod(request);
	// }
	// },
	// @Deprecated
	// API_SERVICES_STREAM_SUB_DOMAINS("API_SERVICES_STREAM_SUB_DOMAINS_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "misc/streamsubdomains/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// return AuthorizeUtils.isReadMethod(request);
	// }
	// },

	API_SERVICES_STREAM_UNIT_OF_MESAUREMENT_URL("API_SERVICES_STREAM_UNIT_OF_MESAUREMENT_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/measureunits/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_PHENOMENOM_URL("API_SERVICES_STREAM_PHENOMENOM_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/phenomenon/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_DATATYPE_URL("API_SERVICES_STREAM_DATATYPE_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/datatype/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	// @Deprecated
	// API_SERVICES_TENANT_LIST("API_SERVICES_TENANT_LIST_URL",
	// Config.API_PROXY_SERVICES_BASE_URL + "tenants/") {
	// @Override
	// public boolean isAuthorizeAccess(HttpServletRequest request) {
	// if ("/tenants/".equals(request.getPathInfo()) &&
	// AuthorizeUtils.isReadMethod(request))
	// return true;
	// else if ("/tenants/newNotDefault/".equals(request.getPathInfo()) &&
	// AuthorizeUtils.isWriteMethod(request))
	// return true;
	// else
	// return false;
	// }
	// },
	API_SERVICES_LIFECYCLE_STREAM_REQ_INST("API_SERVICES_LIFECYCLE_STREAM_REQ_INST", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/reqinst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// String tenant = request.getParameter("codTenant") == null?
			// "":request.getParameter("codTenant") ;
			// return AuthorizeUtils.isReadMethod(request)
			// ||
			// tenant.equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
			return true;
		}
	},
	API_SERVICES_LIFECYCLE_STREAM_NEW_VERSION("API_SERVICES_LIFECYCLE_STREAM_NEW_VERSION", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/newversion/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_SERVICES_LIFECYCLE_STREAM_REQ_UNINST("API_SERVICES_LIFECYCLE_STREAM_REQ_UNINST", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/requninst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_SERVICES_VIRTUALENTITY_GEO("API_SERVICES_VIRTUALENTITY_GEO_URL", Config.API_PROXY_SERVICES_BASE_URL + "virtualentitiesgeo") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	// MANAGEMENT
	API_MANAGEMENT_DATASET_DOWNLOAD_URL("API_MANAGEMENT_DATASET_DOWNLOAD_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/download/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// return AuthorizeUtils.getElementInPositionByRequest(request,
			// 3).equals(AuthorizeUtils.getTenantInSession(request));
			return true;
		}
	},
	// MANAGEMENT
	API_MANAGEMENT_DATASET_OPENDATA_URL("API_MANAGEMENT_DATASET_OPENDATA_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/opendata/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// return AuthorizeUtils.getElementInPositionByRequest(request,
			// 3).equals(AuthorizeUtils.getTenantInSession(request));
			return true;
		}
	},
	API_ADMIN_DATASET("API_ADMIN_DATASET_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/datasets") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_ADMIN_DATASET_GROUP_URL("API_ADMIN_DATASET_GROUP_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/datasourcegroups") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_DATASET_GROUP_DATASET_URL("API_ADMIN_DATASET_GROUP_DATASET_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/datasourcegroups/dataset") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_ADMIN_DATASET_GROUP_STREAM_URL("API_ADMIN_DATASET_GROUP_STREAM_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/management/organizations/{organizationCode}/datasourcegroups/stream") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	API_ADMIN_DATASET_GROUP_TYPES_URL("API_ADMIN_DATASET_GROUP_TYPES_URL", Config.API_PROXY_ADMIN_BASE_URL + "1/public/datasourcegroup_types") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	
	@Deprecated
	API_MANAGEMENT_DATASET_LIST("API_MANAGEMENT_DATASET_LIST_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			String visibleFromParm = request.getParameter("visibleFrom");

			if (AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(info.getUser().getActiveTenant())) {
				return true;
			}

			if (AuthorizeUtils.isReadMethod(request)) {
				return visibleFromIsSimilarToInfo(visibleFromParm, info);
			}

			return false;

		}
	},
	API_MANAGEMENT_DATA_STATISTICS("API_PROXY_DATA_STATISTICS_URL", Config.API_PROXY_DATA_STATISTICS_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;

		}
	},
	API_MANAGEMENT_DATASET_DELETE("API_MANAGEMENT_DATASET_DELETE_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "metadata/clearDataset/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
		}
	},
	API_MANAGEMENT_DATASET_REQUEST_UNISTALL("API_MANAGEMENT_DATASET_REQUEST_UNISTALL_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "metadata/requestUninstallDataset/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			boolean auth = AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
			return auth;
		}
	},
	API_MANAGEMENT_DATASET_IMPORT_DATABASE_URL("API_MANAGEMENT_DATASET_IMPORT_DATABASE_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/importDatabase/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// return AuthorizeUtils.getElementInPositionByRequest(request,
			// 3).equals(AuthorizeUtils.getTenantInSession(request));
			return true;
		}
	},
	/*
	 * API_MANAGEMENT_DATASET("API_MANAGEMENT_DATASET_URL",
	 * Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/") {
	 * 
	 * @Override public boolean isAuthorizeAccess(HttpServletRequest request) {
	 * return AuthorizeUtils.checkTenantInSession(request,
	 * AuthorizeUtils.getElementInPositionByRequest(request, 2)); } },
	 */
	API_MANAGEMENT_DATASET_ADD_DATA_URL("API_MANAGEMENT_DATASET_ADD_DATA_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/add/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
		}
	},
	API_DISCOVERY_DATASET("API_DISCOVERY_DATASET_URL", Config.API_PROXY_DISCOVERY_BASE_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_VALIDATE_SIDDHI("API_VALIDATE_SIDDHI", Config.API_PROXY_SERVICES_BASE_URL + "internalstreams/validate/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_ODATA_URL("API_ODATA_URL", Config.API_PROXY_ODATA_BASE_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_RESOURCES_URL("API_RESOURCES_URL", Config.API_PROXY_RESOURCES_BASE_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_STORE_URL("API_STORE_URL", Config.API_PROXY_STORE_BASE_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_METADATA_URL("API_METADATA_URL", Config.API_PROXY_METADATA_BASE_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_ICON("ICON_TEST", Config.API_PROXY_ADMIN_BASE_URL + "1/public/icon") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	};


	private String nameEntity;
	private String baseUrl;

	static Logger log = Logger.getLogger(ApiEntityEnum.class);

	private ApiEntityEnum(String nameEntity, String baseUrl) {
		this.nameEntity = nameEntity;
		this.baseUrl = baseUrl;
	}

	public abstract boolean isAuthorizeAccess(HttpServletRequest request);

	public void addPropertyForJs(String contextPath, Properties prop) {
		prop.put(nameEntity, contextPath + baseUrl);
	}

	public boolean visibleFromIsSimilarToInfo(String visibleFromParm, Info info) {

		String[] visibles = StringUtils.split(visibleFromParm, "|");

		if (visibles != null && visibles.length > 0) {
			for (int i = 0; i < visibles.length; i++) {
				boolean found = false;
				String visibleTenant = visibles[i];

				for (Tenant tenant : info.getUser().getTenants()) {
					if (visibleTenant.equals(tenant.getTenantcode())) {
						found = true;
						break;
					}
				}
				if (!found)
					return false;

			}
			return true;
		}

		return false;

	}

	public boolean isApiCalled(HttpServletRequest request) {
		String requestURI = request.getRequestURI();
		String startWith = baseUrl;
		if (baseUrl.indexOf("{") > 0)
			startWith = baseUrl.substring(0, baseUrl.indexOf("{"));
		// return (requestURI).startsWith(request.getContextPath() + baseUrl);
		return (requestURI).startsWith(request.getContextPath() + startWith);
	}
}
