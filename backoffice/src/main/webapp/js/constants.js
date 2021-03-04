/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

var Constants = Constants || {};


/* Urls */
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
var API_BASE_URL = '/backoffice/api/proxy/';
var API_BASE_SERVICE_URL = '/backoffice/api/proxy/service/';
var API_BASE_DATA_MANAGEMENT_URL = '/backoffice/api/proxy/datamanagement';


/* stream status */
Constants.STREAM_STATUS_DRAFT='draft';
Constants.STREAM_STATUS_REQ_INST='req_inst';
Constants.STREAM_STATUS_INST='inst';
Constants.STREAM_STATUS_REQ_UNINST='req_uninst';
Constants.STREAM_STATUS_UNINST='uninst';

Constants.DATASOURCE_TYPE_DATASET = 'dataset';

Constants.DATASOURCE_STATUS=[{"id_status":1, "statuscode":"draft"},
		{"id_status":2, "statuscode":"inst"},
		{"id_status":3, "statuscode":"req_inst"},
		{"id_status":4, "statuscode":"req_uninst"},
		{"id_status":5, "statuscode":"uninst"},
		{"id_status":6, "statuscode":"prg_inst"},
		{"id_status":7, "statuscode":"prg_uninst"},
		{"id_status":8, "statuscode":"inst_fail"},
		{"id_status":9, "statuscode":"reject"}];


Constants.TENANT_STATUS=[{"id_tenant_status":1, "tenantstatuscode":"draft"},
{"id_tenant_status":2, "tenantstatuscode":"inst"},
{"id_tenant_status":3, "tenantstatuscode":"req_inst"},
{"id_tenant_status":4, "tenantstatuscode":"req_uninst"},
{"id_tenant_status":5, "tenantstatuscode":"uninst"},
{"id_tenant_status":6, "tenantstatuscode":"prg_inst"},
{"id_tenant_status":7, "tenantstatuscode":"prg_uninst"},
{"id_tenant_status":8, "tenantstatuscode":"inst_fail"},
{"id_tenant_status":9, "tenantstatuscode":"reject"}];


/* virtual entity */
Constants.VIRTUALENTITY_TYPE_INTERNAL_ID = 0;
Constants.VIRTUALENTITY_TYPE_DEVICE_ID = 1;

/* Lifecycle */
Constants.LIFECYCLE_STREAM_REQ_INST = 'LIFECYCLE_STREAM_REQ_INST';
Constants.LIFECYCLE_STREAM_REQ_UNINST = 'LIFECYCLE_STREAM_REQ_UNINST';
Constants.LIFECYCLE_STREAM_NEW_VERSION = 'LIFECYCLE_STREAM_NEW_VERSION';

/* Validation */
Constants.VALIDATION_PATTERN_INTEGER = /^(0|\-?[1-9][0-9]*)$/; // integer positive and negative, for only positive use /^\d+$/;
Constants.VALIDATION_PATTERN_FLOAT = /^\s*[-+]?(\d*\.?\d+|\d+\.)(e[-+]?[0-9]+)?\s*$/i;
Constants.VALIDATION_PATTERN_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
Constants.VALIDATION_PATTERN_NO_SPACE = /^(?!.*(?:[ ]))/;
Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY = /^(?!.*(?:[ *./#<>]))/;
Constants.VALIDATION_PATTERN_CODE_STREAM = /^(?!.*(?:[ *./#<>-]))/;



Constants.WEBSOCKET_CONNECTING = 'Connecting';
Constants.WEBSOCKET_CONNECTED = 'Connected';
Constants.WEBSOCKET_NOT_CONNECTED = 'Not Connected';

Constants.LINE_CHART_COLORS = ["#004586","#0084d1", "#d01e2a", "#f37a1f", "#f3c414", "#3d9e00", "#a6d615","#8f69c2","#e4477e"];

Constants.STREAM_ACTIONS = ['install', 'upgrade', 'delete', 'migrate'];
Constants.TENANT_ACTIONS = ['install', 'upgrade', 'delete', 'migrate'];

Constants.BULK_DB_TYPE=[{"id" : "ing", "label" : "Ingestion"},	{"id" : "transf", "label" : "Transformation"}];

Constants.BULK_JDBC_DSCODE=[{"id" :"jdbc",  "description" : "JdbcName"}, {"id" :"dscode",  "description" : "DatasetCode"}];

Constants.PUBBLICATION_WRITE_MODE=[{"id" :"overwrite",  "description" : "overwrite"}, {"id" :"append",  "description" : "append"}];

Constants.OOZIE_STATUS_SUCCESS = 'SUCCEEDED';

Constants.OOZIE_STATUS_FAILED = 'FAILED';

Constants.OOZIE_STATUS_KILLED = 'KILLED';

Constants.RECLAMATION_COLUMNS = [{"name":"description","checked":false}];
