/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

var Constants = Constants || {};


/* Urls */
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
var API_BASE_URL = '/userportal/api/proxy/';
var API_BASE_SERVICE_URL = '/userportal/api/proxy/service/';
var API_BASE_DATA_MANAGEMENT_URL = '/userportal/api/proxy/datamanagement';


Constants.DATASOURCE_TYPE_STREAM = 'stream';
Constants.DATASOURCE_TYPE_DATASET = 'dataset';

/* stream status */
Constants.STREAM_STATUS_DRAFT='draft';
Constants.STREAM_STATUS_REQ_INST='req_inst';
Constants.STREAM_STATUS_INST='inst';
Constants.STREAM_STATUS_REQ_UNINST='req_uninst';
Constants.STREAM_STATUS_UNINST='uninst';

/* virtual entity */
Constants.VIRTUALENTITY_TYPE_INTERNAL_ID = 0;
Constants.VIRTUALENTITY_TYPE_DEVICE_ID = 1;
Constants.VIRTUALENTITY_TYPE_TWITTER_ID = 3;

/* tenant type */
Constants.TENANT_TYPE_PERSONAL_ID = 2;  
Constants.TENANT_TYPE_TRIAL_ID = 4;   

/* column data type */
Constants.COMPONENT_DATA_TYPE_INT = 1;
Constants.COMPONENT_DATA_TYPE_LONG = 2;
Constants.COMPONENT_DATA_TYPE_DOUBLE = 3;
Constants.COMPONENT_DATA_TYPE_FLOAT = 4;
Constants.COMPONENT_DATA_TYPE_STRING = 5;
Constants.COMPONENT_DATA_TYPE_BOOLEAN= 6;
Constants.COMPONENT_DATA_TYPE_DATETIME = 7;
Constants.COMPONENT_DATA_TYPE_LONGITUDE = 8;
Constants.COMPONENT_DATA_TYPE_LATITUDE = 9;
Constants.COMPONENT_DATA_TYPE_BINARY = 10;
Constants.COMPONENT_DEFAULT_DATA_TYPE = Constants.COMPONENT_DATA_TYPE_STRING;

Constants.VIRTUALENTITY_CATEGORY_NONE = 999;

/* Lifecycle */
//Constants.LIFECYCLE_STREAM_REQ_INST = 'LIFECYCLE_STREAM_REQ_INST';
//Constants.LIFECYCLE_STREAM_REQ_UNINST = 'LIFECYCLE_STREAM_REQ_UNINST';
//Constants.LIFECYCLE_STREAM_NEW_VERSION = 'LIFECYCLE_STREAM_NEW_VERSION';
Constants.LIFECYCLE_STREAM_REQ_INST = 'req_install';
Constants.LIFECYCLE_STREAM_REQ_UNINST = 'req_uninstall';
Constants.LIFECYCLE_STREAM_NEW_VERSION = 'new_version';



/* Validation */
Constants.VALIDATION_PATTERN_INTEGER = /^(0|\-?[1-9][0-9]*)$/; // integer positive and negative, for only positive use /^\d+$/;
Constants.VALIDATION_PATTERN_FLOAT = /^\s*[-+]?(\d*\.?\d+|\d+\.)(e[-+]?[0-9]+)?\s*$/i;
Constants.VALIDATION_PATTERN_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
Constants.VALIDATION_PATTERN_NO_SPACE = /^(?!.*(?:[ ]))/;
Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY = /^(?!.*(?:[ *./#<>àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]))/;
Constants.VALIDATION_PATTERN_CODE_STREAM =        /^(?!.*(?:[ *./#<>àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ-]))/;
Constants.VALIDATION_PATTERN_ACCENT =        /.*[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ].*/;
Constants.VALIDATION_PATTERN_ALPHANUMERIC = /^[a-zA-Z0-9]*$/;
Constants.VALIDATION_PATTERN_ALPHANUMERICORUNDERSCORE = /^[a-zA-Z0-9_]*$/;


/* Numero di elementi nella Error Log */
Constants.MAX_NR_ERROR_LOGS = 30;

Constants.WEBSOCKET_CONNECTING = 'Connecting';
Constants.WEBSOCKET_CONNECTED = 'Connected';
Constants.WEBSOCKET_NOT_CONNECTED = 'Not Connected';



Constants.DISCOVERY_FIELD_STCODE = 'DISCOVERY_FIELD_STCODE';
Constants.DISCOVERY_FIELD_STNAME = 'DISCOVERY_FIELD_STNAME';
Constants.DISCOVERY_FIELD_STDESC = 'DISCOVERY_FIELD_STDESC';

Constants.DEFAULT_SIDDHI = 'from outputStream#window.time(30 sec) \n select count(time) as numEventsLast30Sec \n output last every 2 sec \n insert into tempOutputStat for all-events; \n from tempOutputStat#window.length(1) \n select numEventsLast30Sec,"" as lastMessage,"" as lastUpdate \n output snapshot every 2 sec insert into outputStat for all-events'; 
var operationNuberList=[
                        {key:" = ",value:" eq "},
                        {key:" != ",value:" ne "},
                        {key:" < ",value:" lt "},
                        {key:" > ",value:" gt "},
                        {key:" <= ",value:" le "},
                        {key:" >= ",value:" ge "}];


var operationStringList=[
                         {key:" = ",value:" eq "},
                         {key:" != ",value:" ne "},
                         {key:" contains ",value:" substringof "},
                         {key:" startswith ",value:" startswith "},
                         {key:" endswith ",value:" endswith "}];


Constants.DISCOVERY_FIELDS = [
                              {key:Constants.DISCOVERY_FIELD_TITLE, api_key: 'datasetName', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_TAG, api_key: 'tags', discrete: true,visible:true},
                              {key:Constants.DISCOVERY_FIELD_LICENSE, api_key: 'license', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_TENANT, api_key: 'tenantCode', discrete: true,visible:true},
                              {key:Constants.DISCOVERY_FIELD_FPS, api_key: 'fps', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_UNIT_OF_MEASUREMENT, api_key: 'measureUnit', discrete: true,visible:true},
//                              {key:Constants.DISCOVERY_FIELD_STCODE, api_key: 'streamCode', discrete: false,visible:true},
//                              {key:Constants.DISCOVERY_FIELD_STNAME, api_key: 'streamName', discrete: false,visible:false},
//                              {key:Constants.DISCOVERY_FIELD_STDESC, api_key: 'streamDescription', discrete: false,visible:false}
                              ];
Constants.DISCOVERY_FIELD_OPERATIONS={
		datasetName:operationStringList,
		tags:operationStringList,
		license:operationStringList,
		tenantCode:operationStringList,
		measureUnit:operationStringList,
		fps:operationNuberList
};

Constants.BULK_DATASET_MAX_FILE_SIZE = 10000000;
Constants.STREAM_ICON_MAX_FILE_SIZE = 500000;
Constants.DATASET_ICON_MAX_FILE_SIZE = 500000;
Constants.DATABASE_IMPORT_SOURCEFILE_MAX_FILE_SIZE = 1000000;

Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT = 1000000;

Constants.LINE_CHART_COLORS = ["#004586","#0084d1", "#d01e2a", "#f37a1f", "#f3c414", "#3d9e00", "#a6d615","#8f69c2","#e4477e"];

Constants.TWITTER_GEO_SEARCH_RADIUS_UNIT = {"mi":"miles","km":"kilometers"};
Constants.DEFAULT_STREAM_ICON = "img/stream-icon-default";
Constants.DEFAULT_DATASET_ICON = "img/dataset-icon-default"



Constants.OPENDATA_LANGUAGES = {
		"el":"ελληνικά",
		"en":"English",
		"es":"Español",
		"fr":"Français",
		"it":"Italiano",
		"sl":"Slovenščina",
		"sr":"Српски"
};

Constants.OPENDATA_UPDATE_FREQUENCY = ["TRIENNIAL", "BIENNAL", "ANNUAL","ANNUAL_2","ANNUAL_3","QUARTERLY","BIMONTHLY","MONTHLY","MONTHLY_2","BIWEEKLY","MONTHLY_3","WEEKLY","WEEKLY_2","WEEKLY_3","DAILY","UPDATE_CONT","IRREG","UNKNOWN","OTHER","DAILY_2","CONT","NEVER","OP_DATPRO"];

Constants.ODATA_MAX_RESULT_SORTABLE = 100000;

// license
Constants.STREAM_FIELD_METADATA_LICENSE_CCBY = 'CC BY 4.0';
Constants.STREAM_FIELD_METADATA_LICENSE_CC0 = 'CC 0 1.0';

Constants.LICENSE_CC0_ID = 1;
Constants.LICENSE_CCBY_ID = 33;


// html hint
Constants.HELP_HINT_DATE_FORMAT_TABLE = '<div><table class="table table-supercondensed table-dateformat-help">'+
'	<thead>'+
'		<tr><th>Letter</th><th>Date or Time</th><th>Presentation</th><th>Examples</th></tr>'+
'	</thead>'+
'	<tbody>'+
'		<tr><td><strong>G</strong></td><td>Era designator</td><td>Text</td><td><strong>AD</strong></td></tr>'+
'		<tr><td><strong>y</strong></td><td>Year</td><td>Year</td><td><strong>1996</strong>;<strong>96</strong></td></tr>'+
'		<tr><td><strong>M</strong></td><td>Month in year</td><td>Month</td><td><strong>July</strong>; <strong>Jul</strong>; <strong>07</strong></td></tr>'+
'		<tr><td><strong>w</strong></td><td>Week in year</td><td>Number</td><td><strong>27</strong></td></tr>'+
'		<tr><td><strong>W</strong></td><td>Week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
'		<tr><td><strong>D</strong></td><td>Day in year</td><td>Number</td><td><strong>189</strong></td></tr>'+
'		<tr><td><strong>d</strong></td><td>Day in month</td><td>Number</td><td><strong>10</strong></td></tr>'+
'		<tr><td><strong>F</strong></td><td>Day of week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
'		<tr><td><strong>E</strong></td><td>Day in week</td><td>Text</td><td><strong>Tuesday</strong>; <strong>Tue</strong></td></tr>'+
'		<tr><td><strong>a</strong></td><td>Am/pm marker</td><td>Text</td><td><strong>PM</strong></td></tr>'+
'		<tr><td><strong>H</strong></td><td>Hour in day (0-23)</td><td>Number</td><td><strong>0</strong></td></tr>'+
'		<tr><td><strong>k</strong></td><td>Hour in day (1-24)</td><td>Number</td><td><strong>24</strong></td></tr>'+
'		<tr><td><strong>K</strong></td><td>Hour in am/pm (0-11)</td><td>Number</td><td><strong>0</strong></td></tr>'+
'		<tr><td><strong>h</strong></td><td>Hour in am/pm (1-12)</td><td>Number</td><td><strong>12</strong></td></tr>'+
'		<tr><td><strong>m</strong></td><td>Minute in hour</td><td>Number</td><td><strong>30</strong></td></tr>'+
'		<tr><td><strong>s</strong></td><td>Second in minute</td><td>Number</td><td><strong>55</strong></td></tr>'+
'		<tr><td><strong>S</strong></td><td>Millisecond</td><td>Number</td><td><strong>978</strong></td></tr>'+
'		<tr><td><strong>z</strong></td><td>Time zone</td><td>General time zone</td><td><strong><span title="Pacific Standard Time; PST; GMT-08:00">Pacific Standard Time; PST; &hellip;</td></tr>'+
'		<tr><td><strong>Z</strong></td><td>Time zone</td><td>RFC 822 time zone</td><td><strong>-0800</strong></td>'+
'	</tbody>'+
'</table>' + 
'   </div>'+
'   <p>&nbsp;</p><p>For detail refer to <a href="http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html" target="_blank" class="alert-link">Java Date Format</a></p>'; 


// domain icon
Constants.DOMAIN_ICON_MAP= {
		"TRADE":"\ue800",
		"TRANSPORT":"\ue801",
		"CULTURE":"\ue802", 
		"ECONOMY_FINANCES_TAXES":"\ue803", 
		"AGRICULTURE":"\ue804", 
		"EMPLOYMENT_TRAINING":"\ue805", 
		"ENERGY":"\ue806", 
		"ENVIRONMENT":"\ue807", 
		"GOVERNMENT":"\ue808", 
		"HEALTH":"\ue809", 
		"POPULATION_SOCIAL_ISSUE":"\ue80a", 
		"PRODUCTION":"\ue80b", 
		"SCHOOL":"\ue80c",
		"SCIENCE_TECHNOLOGY":"\ue80d", 
		"SECURITY":"\ue80e", 
		"SMART_COMMUNITY":"\ue80f",
		"TERRITORY":"\ue810", 
		"TOURISM_SPORT":"\ue811"
};

//Constants.DATASOURCE_GROUP_SPECIAL_TYPE = {
//		2:{color: "#9eabb0"},
//		3:{color: "#364e59"},
//		4:{color: "#0e232e"},
//		5:{color: "#666666"},
//		6:{color: "#494f51"},
//		7:{color: "#9eabb0"},
//		8:{color: "#7e8e95"},
//		9:{color: "#657279"},
//};

Constants.DATASOURCE_GROUP_SPECIAL_TYPE = {
		2:{color: "#aeaeae"},
		3:{color: "#898989"},
		4:{color: "#545253"},
		5:{color: "#202020"},
		6:{color: "#494f51"},
		7:{color: "#9eabb0"},
		8:{color: "#7e8e95"},
		9:{color: "#657279"},
};


