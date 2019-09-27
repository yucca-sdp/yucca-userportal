/******************************************************************************************************************************************/
/*                                                                                                                                        */
/*    WARNING: this file is for local developing: don't use it. Use /main/java/it/csi/sdp/userportal/i18n/MessagesBundle_en.properties    */
/*                                                                                                                                        */
/******************************************************************************************************************************************/

var translations_en = {
	
	LANG_KEY: 'en', 
	
	/*common */
	CANCEL : 'Cancel',
	SAVE: 'Save',
	UNDO: 'Undo',
	DELETE: 'Delete',
	SAVE_DRAFT: 'Save draft',
	COMING_SOON: 'Coming soon...', 
	WARNING: 'Warning', 
	WARNING_SUBTITLE: 'Please verify',
	LOADING: 'Please wait...',
	YES: 'Yes',
	NO: 'No',
	OK: 'Ok',
	BACK: 'Back',

	/* main menu */
	MENU_HOME : 'Home',
	MENU_DASHBOARD : 'Dashboard',
	MENU_MANAGEMENT : 'Management',
	MENU_DISCOVERY : 'Discovery',
	MENU_MARKET : 'Market',
	MENU_STORE : 'Store',
	MENU_LANG_EN : 'English',
	MENU_LANG_IT : 'Italian',
	MENU_SING_IN: 'Sign in',
	MENU_SING_OUT: 'Sign out',
	
	/* Entity */
	STREAM: 'Stream',
	TENANT: 'Tenant',
	VIRTUALENTITY: 'Smart Object', 
	DATASET: 'Dataset',
	
	/* STREAM */
	STREAM_FIELD_ID_STREAM: 'ID Stream',
	STREAM_FIELD_ID_VIRTUAL_ENTITY: 'ID Smart Object',
	STREAM_FIELD_NAME: 'Name',
	STREAM_FIELD_DESCRIPTION:'Description',
	STREAM_FIELD_CODE: 'Code',
	STREAM_FIELD_TENANT_CODE : 'Code',
	STREAM_FIELD_TENANT_NAME : 'Name',
	STREAM_FIELD_STATUS: 'Status',
	STREAM_FIELD_MESSAGE_SIZE : 'Message Size',
	STREAM_FIELD_MESSAGE_SIZE_AVERAGE : 'Average',
	STREAM_FIELD_MESSAGE_SIZE_MIN : 'Min',
	STREAM_FIELD_MESSAGE_SIZE_MAX : 'Max',
	STREAM_FIELD_NUM_EVENTS_QUEUED : 'Num. of queued events',
	STREAM_FIELD_VIRTUALENTITY_CODE: 'Code', 
	STREAM_FIELD_VIRTUALENTITY_NAME: 'Name', 
	STREAM_FIELD_VIRTUALENTITY_TYPE: 'Type', 
	STREAM_FIELD_VIRTUALENTITY_DESCRIPTION : 'Description',
	STREAM_FIELD_COMPONENTS : 'Components',
	STREAM_FIELD_COMPONENTS_ID: 'ID',
	STREAM_FIELD_COMPONENTS_NAME: 'Name',
	STREAM_FIELD_COMPONENTS_UNIT_OF_MEASUREMENT : 'Unit of measurement',
	STREAM_FIELD_COMPONENTS_TOLERANCE: 'Tolerance',
	STREAM_FIELD_COMPONENTS_PHENOMENON: 'Phenomenon',
	STREAM_FIELD_COMPONENTS_DATA_TYPE : 'Data type',
	STREAM_FIELD_COMPONENTS_DESCRIPTION : 'Description',
	STREAM_FIELD_DOMAIN : 'Domain',
	STREAM_FIELD_LICENCE : 'Licence',
	STREAM_FIELD_DISCLAIMER : 'Disclaimer',
	STREAM_FIELD_COPYRIGHT : 'Copyright',
	STREAM_FIELD_VISIBILITY : 'Visibility',
	STREAM_FIELD_TAGS : 'Tags',
	STREAM_FIELD_FPS : 'FPS',
	STREAM_FIELD_CREATION_DATE: 'Created',
	STREAM_FIELD_LASTUPDATE : 'Lastupdate',
	STREAM_FIELD_EVENTS : 'Events',
	STREAM_FIELD_VERSION : 'Installed Version',
	STREAM_FIELD_IN_STORE: 'In the store',
	STREAM_FIELD_ICON: 'Icon for the store',
	STREAM_FIELD_TENANTSSHARING: 'Share with ',
	STREAM_FIELD_TENANTSSHARED_WITH: 'Shared with',

	STREAM_INPUT_FIELDS: 'Stream in Input Definition',
	STREAM_NEW_DEFINITION: 'Smart Object ',
	STREAM_AGGREGATE_DEFINITION: 'Internal Streams ',
	STREAM_TYPE_DEFINITION: 'Creation from ',
	STREAM_FIELDSET: 'Internal Stream Definition',
	STREAM_FIELD_COMPONENTS_OUTPUT: 'Components of the stream in output',
	STREAM_INTERNAL_SELECTED_STREAM: 'Selected Stream',
	
	STREAM_SIDDHI_QUERY_SUCCESS: "The query siddhi is valid.",
	STREAM_SIDDHI_QUERY: "SIDDHI query ",
	STREAM_SIDDHI_QUERY_DEFAULT:"Default added in the end:",
	STREAM_SIDDHI_VALIDATE_BUTTON:'Validate',
	STREAM_SIDDHI_PLEASE_VALIDATE:'Please validate Query before saving stream!',
	STREAM_SIDDHI_PLEASE_OUTPUTSTREAM:'Please insert "outputStream" case sensitive in the query.',
	STREAM_SIDDHI_INSERT_COMPONENT:"Before validation it is necessary to add the components to the stream",

	/* Stream placeholder */
	STREAM_FIELD_CODE_PLACEHOLDER : 'e.g. temperature',
	STREAM_FIELD_NAME_PLACEHOLDER : 'e.g. dinner room temperature',
	STREAM_FIELD_COMPONENTS_ID_PLACEHOLDER: 'e.g. 1.4',
	STREAM_FIELD_COMPONENTS_NAME_PLACEHOLDER: 'e.g. wind',
	STREAM_FIELD_COMPONENTS_TOLERANCE_PLACEHOLDER: 'e.g. 12',
	
	/* Stream List */
	STREAM_LIST_TENANT_FILTER : 'Filter by tenant',
	STREAM_LIST_NAME_FILTER : 'Filter by name',
	STREAM_LIST_CODE_FILTER : 'Filter by code',
	STREAM_LIST_STATUS_FILTER : 'Filter by status',
	STREAM_LIST_LASTUPDATE_FILTER : 'Filter by lastupdate',
	
	/* Creator of Stream */
	USER_APPLICANT:'Applicant',
	USER_FIELD_NAME:'Username',
	USER_FIELD_SURNAME:'Surname',
	USER_FIELD_EMAIL : 'Email',
	USER_FIELD_ACCEPT:'Terms',
	USER_FIELD_PRIVACY: 'Privacy',
	USER_FIELD_RESPONSABILITY: 'Responsability',
	USER_FIELD_ACCEPT_YES:'I Accept ',
	USER_FIELD_ACCEPT_NO:"I Don't Accept ",
	
	//USER_FIELD_ACCEPT_PRIVACY:'Dopo aver preso visione dell\'informativa sulla Privacy ai sensi dell\'art. 13 del D.Lgs 196/2013, autorizzo il CSI Piemonte al trattamento dei dati personali qui inseriti con le modalit&agrave; e per le finalit&agrave; in essa contenute',
	USER_FIELD_ACCEPT_PRIVACY:'<p><strong>INFORMATIVA PRIVACY AI SENSI DELL\'ART. 13 DEL D.LGS. 196/2003</strong></p> '+
		'<p>Il trattamento dei dati personali forniti dall\'Utente con la compilazione del form, &egrave; disciplinato dal D.Lgs. n. 196/2003 (Codice in materia di protezione dei dati personali) e s.m.i.</p> '+
		'<p>Ai sensi dell\'art. 13 del D.Lgs. 196/2003, CSI-Piemonte informa pertanto, di quanto segue:</p> '+
		'<ol type=\'a\'> '+
		'<li> i dati saranno trattati, in base a principi di correttezza, liceit&agrave; e trasparenza, al solo fine di associare un referente ai dati forniti alla Piattaforma SDP;</li> '+
		'<li> il conferimento dei dati ed il consenso al trattamento sono liberi e facoltativi. Tuttavia l\'eventuale rifiuto  comporter&agrave; l\'impossibilit&agrave; per CSI Piemonte di raggiungere la finalit&agrave; suindicata;</li> '+
		'<li> i dati saranno trattati sia con sistemi automatizzati sia manualmente, e, in ogni caso, a tutela e garanzia della riservatezza dei dati forniti in modo da ridurre al minimo la soglia di rischio di accessi abusivi, furti o manomissioni dei dati stessi, in conformit&agrave; a quanto previsto dagli artt. 31 ss del D.Lgs. n. 196/2003 e s.m.i. e dall\'Allegato B allo stesso decreto;</li> '+
		'<li> i dati saranno trattati da personale "Incaricato" ai sensi dell\'art. 4, comma 1, lett. h) del Codice Privacy previa adeguate istruzioni operative, per il tempo strettamente necessario al raggiungimento delle finalit&agrave; suindicate;</li> '+
		'<li> i dati non saranno oggetto di comunicazione a terzi e diffusione, fatti salvi gli obblighi di legge nazionale e comunitaria;</li> '+
		'<li> il Titolare del trattamento &egrave; CSI-Piemonte, con sede in corso Unione Sovietica 216, Torino;</li> '+
		'<li> CSI-Piemonte ha nominato i Responsabili interni per il trattamento dei dati personali. L\'elenco completo e aggiornato di tali Responsabili e delle rispettive; funzioni pu&ograve; essere richiesto al Titolare scrivendo all\'indirizzo e-mail privacy@csi.it;</li> '+
		'<li> in relazione al trattamento dei dati che lo riguardano l\'interessato ha diritto ad ottenere le informazioni previste dall\'articolo 7 del decreto in oggetto. Potr&agrave; avvalersi dei diritti di cui all\'art. 7 del D.Lgs. n. 196/2003 e s.m.i. (tra cui quelli di ottenere dal Titolare, anche per il tramite dei Responsabili o degli Incaricati, la conferma dell\'esistenza o meno dei suoi dati personali e la loro messa a disposizione in forma intelligibile; di avere conoscenza della logica e delle finalit&agrave; su cui si basa il trattamento; di ottenere la cancellazione, la trasformazione in forma anonima o il blocco dei dati trattati in violazione di legge, nonch&eacute; l\'aggiornamento, la rettificazione o, se vi &egrave; interesse, l\'integrazione dei dati; di opporsi per motivi legittimi al trattamento stesso) rivolgendosi al Titolare, CSI- Piemonte Corso Unione Sovietica 216 Torino; e-mail: privacy@csi.it, tel. 011-3168111.</li> '+
		'</ol>',
	
	USER_FIELD_ACCEPT_STREAM_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle "Linee guida per l\'integrazione in Smart Data Net", dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione degli altri fruitori della piattaforma lo stream conferito- nonch&eacute; sue eventuali elaborazioni -  senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',
	USER_FIELD_ACCEPT_DATASET_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle "Linee guida per l\'integrazione in Smart Data Net", dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione degli altri fruitori della piattaforma il dataset conferito- nonch&eacute; sue eventuali elaborazioni -  senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',

	/* Creator of Stream PlaceHolder */
	USER_FIELD_NAME_PLACEHOLDER:'Your name',
	USER_FIELD_SURNAME_PLACEHOLDER:'Your surname',
	USER_FIELD_EMAIL_PLACEHOLDER : 'Your@Email',

	/* Virtual Entity */
	VIRTUALENTITY_FIELD_ID: 'ID Smart Object',
	VIRTUALENTITY_FIELD_CODE: 'Code',
	VIRTUALENTITY_FIELD_ID_TENANT : 'Id tenant',
	VIRTUALENTITY_FIELD_TENANT_CODE:"Tenant Code",
	VIRTUALENTITY_FIELD_TYPE : 'Type',
	VIRTUALENTITY_FIELD_CATEGORY: 'Category',
	VIRTUALENTITY_FIELD_NAME: 'Name',
	VIRTUALENTITY_FIELD_DESCRIPTION: 'Description',
	VIRTUALENTITY_FIELD_CATEGORY_ID: 'ID category',
	VIRTUALENTITY_FIELD_TYPE_ID: 'ID Type',
	VIRTUALENTITY_FIELD_STREAMS_COUNT: 'Number of Streams',
	VIRTUALENTITY_FIELD_STATUS: 'Status',
	/* new */
	VIRTUALENTITY_FIELD_POSITION_TYPE: 'Position',
	VIRTUALENTITY_FIELD_POSITION_TYPE_STATIC: 'Static',
	VIRTUALENTITY_FIELD_POSITION_TYPE_MOBILE: 'Mobile',
	VIRTUALENTITY_FIELD_POSITION: 'Position',
	VIRTUALENTITY_FIELD_LATITUDE: 'Latitude',
	VIRTUALENTITY_FIELD_LONGITUDE: 'Longitude',
	VIRTUALENTITY_FIELD_ELEVATION: 'Elevation', 
	VIRTUALENTITY_FIELD_ESPOSITION: 'Esposition',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR_ADDITIONAL: 'Indoor',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR: 'Indoor',
	VIRTUALENTITY_FIELD_ESPOSITION_OUTDOOR: 'Outdoor',
	VIRTUALENTITY_FIELD_INDOOR_BUILDING: 'Building',
	VIRTUALENTITY_FIELD_INDOOR_ROOM: 'Room',
	VIRTUALENTITY_FIELD_INDOOR_FLOOR: 'Floor', 
	VIRTUALENTITY_FIELD_CREATION_DATE: 'Creation Date',
	VIRTUALENTITY_FIELD_MODEL: 'Model',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE: 'Supply',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_AUTO: 'Auto',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_NETWORK: 'Network',
	VIRTUALENTITY_FIELD_ADMIN_URI: 'Administration URI',
	VIRTUALENTITY_FIELD_SOFTWARE_VERSION: 'Software version',
		
	/* Dataset */
	DATASET_FIELD_ID: 'ID',
	DATASET_FIELD_VERSION: 'Version',
	DATASET_FIELD_CONFIGDATA_ID: 'Id Dataset',
	DATASET_FIELD_CONFIGDATA_CODE: 'Code',
	DATASET_FIELD_CONFIGDATA_TENANT: 'Tenant',
	DATASET_FIELD_CONFIGDATA_COLLECTION: 'Collection',
	DATASET_FIELD_CONFIGDATA_TYPE: 'Type',
	DATASET_FIELD_CONFIGDATA_SUBTYPE: 'Subtype',
	DATASET_FIELD_CONFIGDATA_DATAVERSION: 'Version',
	DATASET_FIELD_METADATA_NAME: 'Name',
	DATASET_FIELD_METADATA_DESCRIPTION: 'Description',
	DATASET_FIELD_METADATA_DISCLAIMER: 'Disclaimer',
	DATASET_FIELD_METADATA_LICENSE: 'License',
	DATASET_FIELD_METADATA_COPYRIGHT: 'Copyright',
	DATASET_FIELD_METADATA_VISIBILITY: 'Visibility',
	DATASET_FIELD_METADATA_REGISTRATIONDATE: 'Registration date',
	DATASET_FIELD_METADATA_DATADOMAIN: 'Domain',
	DATASET_FIELD_METADATA_FPS: 'FPS',
	DATASET_FIELD_TENANTSSHARING: 'Share with ',
	DATASET_FIELD_TENANTSSHARED_WITH: 'Shared with ',
		
	DATASET_FIELD_METADATA_STARTINGESTIONDATE: 'Begin upload',
	DATASET_FIELD_METADATA_ENDINGESTIONDATE: 'End upload',
	DATASET_FIELD_METADATA_IMPORTFILETYPE: 'File Type',
	DATASET_FIELD_METADATA_DATASETSTATUS: 'Status',
	DATASET_FIELD_METADATA_TAGS: 'Tag',
	DATASET_FIELD_METADATA_FIELDS: 'Fields',
	DATASET_FIELD_METADATA_FIELD_NAME: 'Name',
	DATASET_FIELD_METADATA_FIELD_ALIAS: 'Alias',
	DATASET_FIELD_METADATA_FIELD_DATATYPE: 'Data type',
	DATASET_FIELD_METADATA_FIELD_DATATYPE_FORMAT: 'Date format', 
	DATASET_FIELD_METADATA_FIELD_SOURCE_COLUMN: 'Source',
	DATASET_FIELD_METADATA_FIELD_SOURCE_COLUMN_HINT: 'Write the column index in the source file',
	DATASET_FIELD_METADATA_FIELD_IS_KEY: 'Key',
	DATASET_FIELD_METADATA_FIELD_UNIT: 'Measurement unit',
	DATASET_FIELD_TENANTSSHARED_WITH: 'Shared with',
	
	/* Cookie */
	COOKIE_MESSAGE: 'This site uses cookies to improve the browsing experience. Continuing navigation you accept the use of cookies',
	COOKIE_ACCEPT: 'Accept',
	COOKIE_DECLINE: 'Decline',

	/* Dataset placeholder */
	DATASET_FIELD_NAME_PLACEHOLDER : 'e.g. museum 2014',
	DATASET_FIELD_METADATA_FIELD_IS_KEY_PLACEHOLDER: 'key',
	
	
	/* Stream domains */
	AGRICULTURE: 'Agriculture',
	ENERGY: 'Energy',
	ENVIRONMENT: 'Environment',
	HEALTH: 'Health',
	SCHOOL: 'School',
	SECURITY: 'Security',
	TRANSPORT: 'Transport',
	
	/* Stream tags */
	AIR: 'Air',
	CARBON: 'Carbon',
	CONSUMPTION: 'Consumption',
	DIOXIDE: 'Dioxide',
	FIRE: 'Fire',
	FOREST: 'Forest',
	GLACIER: 'Glacier',
	INDOOR: 'Indoor',
	LAKE: 'Lake',
	LANDSLIDE: 'Landslide',
	MONOXIDE: 'Monoxide',
	NITROGEN: 'Nitrogen',
	OZONE: 'Ozone',
	POLLUTION: 'Pollution',
	RAIN: 'Rain',
	RIVER: 'River',
	SNOW: 'Snow',
	WATER: 'Water',
	POWDERS: 'Powders',
	QUALITY: 'Quality',
	NOISE: 'Noise',
	OUTDOOR: 'Outdoor',
	PRODUCTION: 'Production',
	STORM: 'Storm',
	GROUND: 'Ground',
	TRAFFIC: 'Traffic',
	WIND: 'Wind',
	SULPHUR: 'Sulphur',
	VINEYARD: 'Vineyard',
	COMFORT: 'Comfort',
	LIGHTNING: 'Lightning',
	PEOPLE: 'People', 
	
	/* Validations */
	VALIDATION_PATTERN_INTEGER_TOOLTIP: 'Only integer number',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Only decimal number',
	VALIDATION_PATTERN_UUID_TOOLTIP: 'The code entered doesn\'t match with the pattern: 8-4-4-4-12 hexadecimal digits',
	VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP: 'The code entered cannot contain white space or * . / # ',
	VALIDATION_PATTERN_MAXLENGTH_TOOLTIP: 'The value is too long',
	VALIDATION_PATTERN_NO_SPACE_TOOLTIP: 'The value cannot contains white spaces',
	VALIDATION_PATTERN_CODE_STREAM_TOOLTIP: 'The code entered cannot contain white space or * . / # - ',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Insert a decimal number using dot as separator',
	
	/* stream status */
	draft:'draft',
    req_inst:'installation in progress',
    inst:'installed',
    req_uninst:'uninstall in progress',
    uninst:'uninstalled and historicized',
	
	/* Virtual Entity List */
	VIRTUALENTITY_LIST_CODE_FILTER: 'Filter by code',
	VIRTUALENTITY_LIST_STATUS_FILTER: 'Filter by status',

	/* Dataset List */
	DATASET_LIST_NAME_FILTER: 'Filter by name',
	DATASET_LIST_STATUS_FILTER: 'Filter by status',

	/* Home page */
	HOME_TITLE: 'Yucca Platform',
	HOME_SUBTITLE: 'Record smart objects and define transmitted streams',
	HOME_INTRO_HTML: 'Information from the world around us and open solutions: these are the distinctive points of the platform made available by Regione Piemonte for Ecosystem Smart Data Net',
	HOME_START_BUTTON_DESC: 'Sign in with your credential',
	HOME_START_BUTTON: 'Sign in',
	HOME_START_DEMO_BUTTON_DESC: 'Try the platform using the tenant sandbox',
	HOME_START_DEMO_BUTTON: 'Anonymous access to public data', 
	HOME_LOGGED_IN_WELCOME: 'Welcome, ',
	HOME_START_LOGGED_IN_BUTTON: 'Go to your streams',
	HOME_MAP_INTRO: 'Smart object currently active on the territory',
	HOME_STATISTIC_PANEL_TITLE: 'What can you find in the platform',
	HOME_STATISTIC_TOTAL_DATA: 'Available measures',
	HOME_STATISTIC_TOTAL_DATA_TIP: 'Total measures available: ',
	HOME_STATISTIC_TODAY_DATA: 'Measures yesterday',
	HOME_STATISTIC_TODAY_DATA_TIP: 'Total measures recorded yesterday: ',
	HOME_STATISTIC_CURRENT_MONTH_DATA: 'Measures this month',
	HOME_STATISTIC_CURRENT_MONTH_DATA_TIP: 'Total  measures recorded this month: ',
	HOME_STATISTIC_VIRTUALOBJECT_DATA: 'data from smart objects',
	HOME_STATISTIC_VIRTUALOBJECT_DATA_TIP: 'Total data from Smart Object: ',
	HOME_STATISTIC_TENANT: 'Organizations',	
	HOME_STATISTIC_VIRTUALENTITY: 'Active Smart Objects',	
	HOME_STATISTIC_STREAM: 'Online stream',	
	HOME_STATISTIC_LASTUPDATE_INFO: 'Statistics updated on ',
	HOME_OPERATION_PANEL_TITLE:'What can you do with the platform',
	HOME_ROLE_DEVELOPER: 'developer',
	HOME_ROLE_DEVELOPER_INTRO: 'You can create stream  merging other existing stream',
	HOME_ROLE_PUBLISHER: 'publisher',
	HOME_ROLE_PUBLISHER_INTRO: 'You can create and manage Streams, Smart Object and Dataset',
	HOME_ROLE_SUBSCRIBER: 'subscriber',
	HOME_ROLE_SUBSCRIBER_INTRO: 'You can use the data available in the platform',

	HOME_ACTION_DEVELOPER_SEP_1: 'or create a new stream',
	HOME_ACTION_PUBLISHER_SEP_1: 'or add directly the objects ',
	HOME_ACTION_SUBSCRIBER_SEP_1: 'Or search stream and dataset in the store',
	
	HOME_ACTION_DASHBOARD: 'Stream Dashboard',
	HOME_ACTION_MANAGEMENT: 'Management',

	HOME_ACTION_NEW_STREAM_INTERNAL: 'Create Streams',
	HOME_ACTION_NEW_VIRTUAL_ENTITY: 'Create Smart Objects',
	HOME_ACTION_NEW_STREAM: 'Create Stream',
	HOME_ACTION_NEW_DATASET: 'Create Dataset',
	HOME_ACTION_SEARCH: 'Search a Dataset',
	HOME_ACTION_STORE: 'Go to the store',

	
	
	HOME_SEARCH_TITLE: 'Discovery data',
	HOME_STORE_TITLE: 'Go to the store',
	
	
	HOME_HOWTO_TITLE: 'What can I do with the platform',
	HOME_HOWTO_TEXT_HTML: '<li>' + 
							'	<span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/virtualentities/{{tenant}}">Configure</a> your smart object and sends data using your tenant or the demo tenant <strong>Sandbox</strong> ' +
							'	</li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/streams">Consumes</a> all available streams via <strong>WebSocket</strong> or <strong>MQTT</strong></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/main/example">Monitor</a> your streams in the dashboard </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/datasets/sandbox">Import</a> your <strong>bulk dataset </strong> via upload</li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/discovery">Discover and  consume</a> all archived data and dataset via <strong>OData API</strong> </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/streams/sandbox">Create derived streams</a> from one or more streams with <strong>custom logic using SiddhiQL</strong></li>' +
							'<li class="mute"><span class="glyphicon glyphicon-unchecked"></span> &nbsp;Create derived streams simply with wizard (coming soon...)</li>',
							
	/* Dashboard */
	DASHBOARD_TITLE : 'Dashboard streams monitoring',
	
	DASHBOARD_SECTION_OVERVIEW: 'Overview',
	DASHBOARD_SECTION_EXAMPLE: 'Example',
	DASHBOARD_SECTION_TRAFFIC: 'Traffic',
	
	DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR: 'Tenant not configured', 

	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Stream',
	DASHBOARD_STREAM_LIST_VIRTUALENTITY_CODE: 'Smart Object',
	DASHBOARD_STREAM_LIST_TENANT : 'Tenant',
	DASHBOARD_STREAM_LIST_EVENTS : 'Events in the last 30 min.',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Registration date',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Lastupdate',
	DASHBOARD_STREAM_LIST_STATUS : 'Status',
	
	/* Dashboard home */
	DASHBOARD_DASHBOARD_BUTTON: 'Dashboard',
	DASHBOARD_STREAMS_BUTTON: 'Streams list',
	DASHBOARD_ERROR_LOG_BUTTON: 'Error log', 

	//DASHBOARD_STREAM_TITLE: 'Stream <strong>{{stream_name}}</strong>',
	DASHBOARD_STREAM_TITLE: 'Stream ',
	DASHBOARD_STREAM_DETAIL_TITLE : 'Details',
	DASHBOARD_STREAM_DETAIL_TABLE_KEY : 'Field',
	DASHBOARD_STREAM_DETAIL_TABLE_VALUE : 'Value',
	DASHBOARD_STREAM_DETAIL_OTHER_CONFIUGURATION: 'Other configuration',

	DASHBOARD_STREAM_DATA_CHART_TITLE: 'Last 30 data', 
	

	DASHBOARD_STREAM_REALTIME_FPS: 'FPS', 
	DASHBOARD_STREAM_REALTIME_SEC_BTW_EVENTS: 'Sec. between events', 
	DASHBOARD_STREAM_REALTIME_FPM: 'FPM', 
	DASHBOARD_STREAM_REALTIME_MIN_BTW_EVENTS: 'Min. between events', 
	
	
	DASHBOARD_STREAM_DATA_FILTER_CHART_LABEL: 'Choose the serie to be displayed', 
	DASHBOARD_STREAM_DATA_MAIN_INFO_TITLE: 'Main Information', 
	DASHBOARD_STREAM_DATA_DETAIL_INFO_TITLE: 'Detailed information', 
	DASHBOARD_STREAM_DATA_SHARE_INFO_TITLE: 'Sharing information', 

	DASHBOARD_STREAM_REALTIME_STATISTIC_TITLE: 'Statistics', 
	
	DASHBOARD_STREAM_WS_URL_TITLE : 'Web Socket Url',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TITLE : 'Number of Events in the last 30 sec',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_TIME : 'Time',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_COUNT : 'Events',
	DASHBOARD_STREAM_WS_LASTMESSAGE_PANEL_TITLE : 'Last message received',
	DASHBOARD_STREAM_WS_LASTMESSAGE_NOT_RECEIVED: 'No yet new messages, it is displayed the last recorded (if any)', 
	DASHBOARD_STREAM_WS_LASTERROR_PANEL_TITLE : 'Last errors received',
	DASHBOARD_STREAM_WS_LASTMESSAGE_REFRESH_BUTTON : 'Refresh',

	DASHBOARD_STREAM_WS_STATISTICS_TIME_TABLE_TITLE : '# Events',
	DASHBOARD_STREAM_WS_ERROR_TIME_TABLE_TITLE : '# Errors',
	
	DASHBOARD_STREAM_SYSTEM_STATUS : 'System Status',

	DASHBOARD_ERROR_LOG_TITLE: 'Error log',
	DASHBOARD_ERROR_LOG_SUBTITLE: 'Messages sent by the streams that have generated an error',
	DASHBOARD_ERROR_LOG_INTRO: 'Is possible to see error messages not associated with a specific tenant, or error messages in which the tenant is identified. There are displayed the last 3 messages received, is possible  update messages via the refresh button',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_TITLE: 'Choose the errors to view',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_SUBTITLE: '',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_ITEM: 'Platform',
	
	DASHBOARD_ERROR_LIST_CODE : 'Error Code',
	DASHBOARD_ERROR_LIST_NAME : 'Error Name',
	DASHBOARD_ERROR_LIST_TENANT : 'Tenant',
	DASHBOARD_ERROR_LIST_DATE : 'Date',
	

	/* Management */
	MANAGEMENT_TITLE: 'Management',
    MANAGEMENT_MENU_DASHBOARD: 'Dashboard',
    MANAGEMENT_MENU_STREAMS: 'Streams',
    MANAGEMENT_MENU_VIRTUAL_ENTITIES: 'Smart Objects',
    MANAGEMENT_MENU_DATASET: 'Dataset',
    
    MANAGEMENT_SANDBOX_WARNING: 'You are using the demo tenant Sandbox. The data uploaded to this tenant are periodically removed',
    
    MANAGEMENT_DESCRIPTION_ON_STORE_HINT: 'Choose carefully, will be used in the store',

    /* Management Stream  */
	MANAGEMENT_DASHBOARD_SUBTITLE: 'Dashboard',
	MANAGEMENT_DASHBOARD_TENANT_PANEL_TITLE: 'Info about tenant',
    /* Management Stream  */
	MANAGEMENT_STREAM_SUBTITLE: 'Streams',

	/* Management Stream List */
	MANAGEMENT_STREAM_LIST_NEW_STREAM: 'New',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Edit',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Delete',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'To enable editing select a single stream',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'To enable deleting select at least one stream',
	
	/* view stream */
	MANAGEMENT_VIEW_STREAM: 'Stream',
	MANAGEMENT_VIEW_STREAM_INSTALL_BUTTON: 'Request Installation',
	MANAGEMENT_VIEW_STREAM_UNINSTALL_BUTTON: 'Request Unistallation',
	MANAGEMENT_VIEW_STREAM_NEWVERSION_BUTTON: 'Create New Version',
	MANAGEMENT_VIEW_STREAM_HISTORICAL_BUTTON: 'Historical',
	MANAGEMENT_VIEW_STREAM_DELETE_BUTTON: 'Delete',
	MANAGEMENT_VIEW_STREAM_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_STREAM_LIFECYCLE_OK_INFO: 'Success',

	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Create',
	MANAGEMENT_NEW_STREAM_VIRTUALENTITY_PLACEHOLDER : 'Choose one Smart Object',
	MANAGEMENT_NEW_STREAM_SUBTITLE: 'New Stream',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER: 'Registra',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR: 'Richiedente',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL: 'Dettagli',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS: 'Componenti',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE: 'Condividi',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER_TITLE: 'Register the Stream',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR_TITLE: 'Insert the requestor information',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL_TITLE: 'Insert some details',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS_TITLE: 'Describe the components',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE_TITLE: 'Define how to share',
	MANAGEMENT_NEW_STREAM_WIZARD_NEXT:'Next',
		
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Edit ', 
	MANAGEMENT_EDIT_STREAM_TAG_PLACEHOLDER: 'Choose one or more tag...',
	MANAGEMENT_EDIT_STREAM_DOMAIN_PLACEHOLDER: 'Choose one domain...',
	MANAGEMENT_EDIT_STREAM_COMPONENT_EXAMPLE_TITLE: 'Example',
	MANAGEMENT_EDIT_STREAM_UNIT_OF_MEASUREMENT_PLACEHOLDER: 'Choose one...',
	MANAGEMENT_EDIT_STREAM_PHENOMENOM_PLACEHOLDER: 'Choose one...',
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Read from Stream',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA_LABEL: 'Save data',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA: 'Save',
	MANAGEMENT_EDIT_STREAM_DONT_SAVE_DATA: 'Don\'t save',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PUBLIC: 'Public',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PRIVATE: 'Private',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE_LABEL: 'Publication in the Store',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE: 'Published',
	MANAGEMENT_EDIT_STREAM_NOT_PUBLISH_ON_STORE: 'Not Published',
	MANAGEMENT_EDIT_STREAM_SAVE_AS_DRAFT_BUTTON: 'Save as draft',
	MANAGEMENT_EDIT_STREAM_FINISH_BUTTON: 'Finish editing', 
	MANAGEMENT_EDIT_STREAM_ADD_TAG : 'Add tag', 
	MANAGEMENT_EDIT_STREAM_DATA_SAVED_INFO : 'Stream saved',
	MANAGEMENT_EDIT_STREAM_ADD_TENANT_SHARING : 'Add tenant', 
	MANAGEMENT_EDIT_STREAM_TENANT_SHARING_PLACEHOLDER: 'Scegli un tenant...',

	
	MANAGEMENT_EDIT_STREAM_GENERAL_INFO: 'Genearl Info',
	MANAGEMENT_EDIT_STREAM_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_STREAM_SETTINGS: 'Settings',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_DROPAREA: 'Drop here the icon',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_BUTTON_LOAD_FILE: 'Or click here to choose',
	
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TITLE: 'Warning',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED: 'The field \'name\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE: 'The field \'name\' must be unique in a stream',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED: 'The field \'data type\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED: 'The field \'tollerance\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_PHENOMENON_REQUIRED: 'The field \'Phenomenon\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED: 'The field \'Tollerance\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER: 'The field \'tollerance\' must be numeric',
	MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS: 'Isert at least one component',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE: 'The field \'Name\' cannot contain white space',
    
		/* Management Virtual Entity  */
	MANAGEMENT_VIRTUALENTITY_SUBTITLE: 'Smart Objects',

	/* Management Stream List */
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY : 'Create Smart Object',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_APP : 'App',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_DEVICE : 'Device',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_FEED : 'Feed',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY : 'Edit',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY : 'Delete',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY_BUTTON_HINT: 'To enable editing select a single Smart Object',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY_BUTTON_HINT: 'To enable deleting select at least one Smart Object',
  
	/* Management new Virtual Entity  */
	MANAGEMENT_NEW_VIRTUALENTITY_SUBTITLE: 'Create Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_CREATE_BUTTON: 'Create Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_GENERATE_UUID_BUTTON: 'Generate',	
	MANAGEMENT_NEW_VIRTUALENTITY_TYPE_PLACEHOLDER: 'Choose one...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_PLACEHOLDER: 'Choose one...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CODE_HINT: 'Only for device', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_HINT: 'Only for device', 
	
	/* Management edit Virtual Entity  */
	MANAGEMENT_EDIT_VIRTUAL_ENTITY_SUBTITLE: 'Edit ',
	MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO: 'Smart Object Saved',
		
	MANAGEMENT_EDIT_VIRTUALENTITY_GENERAL: 'General Info',
	MANAGEMENT_EDIT_VIRTUALENTITY_COLLOCATION: 'Collocation',
	MANAGEMENT_EDIT_VIRTUALENTITY_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_VIRTUALENTITY_FINISH_BUTTON: 'Finish Editing',
	MANAGEMENT_EDIT_VIRTUALENTITY_SAVE_BUTTON: 'Save',

	MANAGEMENT_VIEW_VIRTUALENTITY_HISTORICAL_BUTTON: 'Historical',
	MANAGEMENT_VIEW_VIRTUALENTITY_DELETE_BUTTON: 'Delete',
	MANAGEMENT_VIEW_VIRTUALENTITY_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_VIRTUALENTITY_INSTALL_BUTTON: 'Install',
	
	/* Management dataset */
	MANAGEMENT_DATASET_SUBTITLE: 'Dataset',
	MANAGEMENT_DATASET_LIST_NEW_DATASET: 'Load new Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET_BUTTON_HINT: 'To enable editing select a single Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET: 'Edit',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET_BUTTON_HINT: 'To enable deleting select at least one Dataset',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET: 'Delete',
	
	MANAGEMENT_VIEW_DATASET_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_DATASET_DOWNLOAD_BUTTON: 'Download',
	MANAGEMENT_VIEW_DATASET_ADD_DATA_BUTTON: 'Add more data',
	MANAGEMENT_VIEW_DATASET_DATA_URLS: 'Data access',
	
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER: 'Register',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION: 'Positions',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL: 'Other info',

	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER_TITLE: 'Register the Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION_TITLE: 'Describe the positions',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL_TITLE: 'Fill the additional fields',

	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_CREATE_BUTTON : 'Create',
	MANAGEMENT_NEW_DATASET_TITLE: 'New Dataset',
	MANAGEMENT_NEW_DATASET_START_SUBTITLE: 'ID',
	MANAGEMENT_NEW_DATASET_CHOOSE_DATASET_TYPE_SUBTITLE: 'Dataset type',
	MANAGEMENT_NEW_DATASET_REQUESTOR_SUBTITLE: 'Requestor',
	MANAGEMENT_NEW_DATASET_METADATA_SUBTITLE: 'Metadata',
	MANAGEMENT_NEW_DATASET_UPLOAD_SUBTITLE: 'File Upload',
	MANAGEMENT_NEW_DATASET_COLUMNS_SUBTITLE: 'Fields',
	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_WIZARD_PREV: 'Back', 
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT: 'Next', 
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT_CREATE_COLUMNS: 'Define columns without uploading the file',
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT_IMPORT_COLUMNS: 'Define columns from the file',
	MANAGEMENT_NEW_DATASET_WIZARD_END: 'Create	 dataset',
	
	MANAGEMENT_NEW_DATASET_CHOOSE_DATASET_TYPE_QUESTION: 'How do you want to create the data set?',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_BINARY: 'Biinary file',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_BINARY_DESC: 'Choose this one if you have movies, pictures or binary files',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_DEFINE_COLUMN: 'Define columns',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_DEFINE_COLUMN_DESC: 'Choose this one to define the structure of the columns in the dataset',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_UPLOAD_FILE: 'Upload csv',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_UPLOAD_FILE_DESC: 'Choose this one to define the structure of the columns of the dataset through the upload of a csv file',
	
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_DROPAREA: 'Drop the file to upload ',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_OR: 'Or',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_BUTTON_LOAD_FILE: 'Click here to choose',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_FORMAT: 'Format',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_ENCODING: 'Encoding',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SEPARATOR: 'Separator',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_MAX_SIZE: 'Max file size supported: ',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_TITLE: 'Warning',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_FILE_TOO_BIG: 'The size of the selected file exceeds the quota limit',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SKIP_UPLOAD_INFO: 'If you do not have the file to upload, you can directly define the columns',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SKIP_UPLOAD_LINK: 'Define columns',
	
	MANAGEMENT_NEW_DATASET_SKIP_COLUMN_HINT: 'Skip column', 
	MANAGEMENT_NEW_DATASET_MOVE_COLUMN_HINT: 'Change column order',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW: 'Skip first row',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW_HELP: 'If the first row contain the name of the columns', 
	MANAGEMENT_NEW_DATASET_COLUMNS_TITLE: 'Columns to import',
	MANAGEMENT_NEW_DATASET_COLUMNS_INTRO: 'Choose the columns that you want to import. Is possible to change the order of import', 
	
	MANAGEMENT_NEW_DATASET_ADD_COLUMN_DEFINITION: 'Add column',
	MANAGEMENT_NEW_DATASET_REMOVE_COLUMN_DEFINITION: 'Remove column',

	MANAGEMENT_NEW_DATASET_CREATE_COLUMNS_TITLE: 'Configure colums',
	MANAGEMENT_NEW_DATASET_CREATE_COLUMNS_INTRO: 'Add the columns that will be in the dataset file', 
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME: 'Column name is required',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE: 'The column name must be unique',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN: 'The column index of the source file is required, and must be numeric',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE: 'The column index of the source file  must be unique',	
	MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN: 'Define at least one column',
	MANAGEMENT_NEW_DATASET_ADD_COLUMN_INPUT_NAME_HINT: 'The name will be cleaned up by spaces and special characters automatically when saving',
	
	
	
	MANAGEMENT_NEW_DATASET_BINARY_TITLE :'Binary file',
	MANAGEMENT_NEW_DATASET_BINARY_INTRO: 'Define at least one binary file',
	MANAGEMENT_NEW_DATASET_ADD_BINARY_DEFINITION: 'Add file definition',
	MANAGEMENT_NEW_DATASET_REMOVE_BINARY_DEFINITION: 'Remove file definition',
	MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME: 'File name is required',
	MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME_UNIQUE: 'Fine name must be unique',
	MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY: 'Define at least one binary file',
	MANAGEMENT_NEW_DATASET_ADD_BINARY_INPUT_NAME_HINT: 'The name will be cleaned up by spaces and special characters automatically when saving',

	/* Management upload dataset*/
	MANAGEMENT_UPLOAD_DATASET_SUBTITLE: 'Load data',
	MANAGEMENT_EDIT_DATASET_SUBTITLE: 'Edit ', 
	MANAGEMENT_EDIT_DATASET_TAG_PLACEHOLDER: 'Choose one or more tag...',
	MANAGEMENT_EDIT_DATASET_UPLOAD_ICON_DROPAREA: 'Drop here the icon',
	MANAGEMENT_EDIT_DATASET_DOMAIN_PLACEHOLDER: 'Choose one domain...',
	MANAGEMENT_EDIT_STREAM_DATATYPE_PLACEHOLDER: 'Choose...',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA_LABEL: 'Save data',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA: 'Save',
	MANAGEMENT_EDIT_DATASET_DONT_SAVE_DATA: 'Don\'t save',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PUBLIC: 'Public',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PRIVATE: 'Private',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE_LABEL: 'Publication in the Store',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE: 'Published',
	MANAGEMENT_EDIT_DATASET_NOT_PUBLISH_ON_STORE: 'Not Published',
	MANAGEMENT_EDIT_DATASET_SAVE_BUTTON: 'Save',
	MANAGEMENT_EDIT_DATASET_FINISH_BUTTON: 'Finish editing', 
	MANAGEMENT_EDIT_DATASET_ADD_TAG : 'Add tag', 
	MANAGEMENT_EDIT_DATASET_DATA_SAVED_INFO : 'Dataset saved',
	MANAGEMENT_EDIT_DATASET_LEGAL_INFO: 'Legal informations', 
	MANAGEMENT_EDIT_DATASET_ADD_TENANT_SHARING : 'Add tenant', 
	MANAGEMENT_EDIT_DATASET_TENANT_SHARING_PLACEHOLDER: 'Choose one tenant...',	

	MANAGEMENT_EDIT_DATASET_API_URL: 'API Url', 
	
	MANAGEMENT_EDIT_DATASET_GENERAL_INFO: 'Genearl Info',
	MANAGEMENT_EDIT_DATASET_COLUMNS: 'Define data structure',
	MANAGEMENT_EDIT_DATASET_COLUMNS_HELP: 'In the data structure you can change only the column\'s alias',

	MANAGEMENT_EDIT_DATASET_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_DATASET_SETTINGS: 'Settings (coming soon)',
	
	MANAGEMENT_EDIT_DATASET_ERROR_COMPONENT_TITLE: 'Warning',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_REQUIRED: 'The field \'code\' is required',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_UNIQUE: 'The field \'code\' must be unique in a dataset',
	
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN: 'There are some errors',
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN_NUM_ERR: 'Number of error\'s',
	
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SUBTITLE: 'Add data',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_FINISH_BUTTON: 'Finish add data',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_UPLOAD_BUTTON: 'Upload',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO: 'Upload data: ', 
		
	/* Choose tenant temp */
	MANAGEMENT_CHOOSE_TENANT_SUBTITLE: 'Choose tenant',
	MANAGEMENT_CHOOSE_TENANT_WARNING: 'Temporary page awaiting authentication system',
	MANAGEMENT_CHOOSE_TENANT_TITLE: 'Choose one tenant',
	
	/* Discovery */
	DISCOVERY_TITLE: 'Discovery',
	DISCOVERY_FILTER_SIMPLESEARCH_LABEL: 'Search',
	DISCOVERY_SIMPLESEARCH_MENU: 'Simple search',
	DISCOVERY_ADVANCEDSEARCH_MENU: 'Advanced search',
	DISCOVERY_FILTER_SIMPLESEARCH_PLACEHOLDER: 'e.g. water or tags:AIR',
	DISCOVERY_FILTER_SIMPLESEARCH_HELP: 'Search operator enabled <strong>tags</strong>, <strong>licence</strong>, <strong>idDataset</strong>, <strong>tenantCode</strong>, <strong>dataDomain</strong>, <strong>fps</strong> ,<br>'+
	' <strong>datasetName</strong>, <strong>visibility</strong>, <strong>measureUnit</strong> , <strong>smartOCode</strong>, <strong>streamCode</strong>, <strong>streamName</strong>, <strong>streamDescription</strong> to use it <i>operator<strong>:</strong><i>value</i> ',
	DISCOVERY_FILTER_ADVANCED_FILTER_LABEL: 'Filter', 
	DISCOVERY_FILTER_SEARCH_BUTTON: 'Search',
	
	DISCOVERY_FILTER_ADVANCED_FIELD_PLACEHOLDER: 'Choose one field',
	
	DISCOVERY_RESULTS_SIZE_LABEL: 'Numero di risultati: ',
	DISCOVERY_RESULTS_NO_DATA_FOUND: 'No result found',
	
	DISCOVERY_BACK_FILTER_LABEL: 'Back to search filter',
	DISCOVERY_BACK_RESULT_LABEL: 'Back to result list',
	
	DISCOVERY_RESULTS_TITLE: 'Result',
	DISCOVERY_RESULTS_DETAIL_BUTTON: 'Detail',
	
	DISCOVERY_DETAIL_DATASET_GENERAL_INFO: 'Main info',
	DISCOVERY_DETAIL_DATASET_LEGAL_INFO: 'Legal informations',
	DISCOVERY_DETAIL_DATASET_STREAM_INFO: 'Stream',
	DISCOVERY_DETAIL_DATASET_SMART_OBJECT_INFO: 'Smart Object',
	DISCOVERY_DETAIL_DATASET_COLUMNS: 'Define data structure',
	DISCOVERY_DETAIL_ACCESS_DATA_TITLE: 'Data access', 
	DISCOVERY_DETAIL_ACCESS_DATA_API: 'Url API OData',
	DISCOVERY_DETAIL_ACCESS_DATA_STREAM: 'Url Stream API',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET: 'Real time stream with web socket',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_SERVER_URL_LABEL: 'Server URL',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_TOPIC_LABEL: 'Topic', 
	DISCOVERY_DETAIL_OPEN_DASHBOARD_STREAM: 'Open Dashboard stream', 
	DISCOVERY_DETAIL_DOWNLOAD_CSV: 'Download data csv url', 
		

	/* Discovery fields */
	DISCOVERY_FIELD_TITLE: 'Name',
	DISCOVERY_FIELD_TAG: 'Tag',
	DISCOVERY_FIELD_LICENSE: 'License',
	DISCOVERY_FIELD_TENANT: 'Tenant',
	DISCOVERY_FIELD_FPS: 'FPS',
	DISCOVERY_FIELD_UNIT_OF_MEASUREMENT: 'Unit of Measurement',
	DISCOVERY_FIELD_STCODE:'StreamCode',
	DISCOVERY_FIELD_VE_NAME:'Smart Object Name',
	DISCOVERY_FIELD_VE_CODE:'Smart Object Code',
	
	DISCOVERY_FIELD_STNAME:'StreamName',
	DISCOVERY_FIELD_STDESC:'StreamDescription',
	
	/* Market */
	MARKET_TITLE: 'Market',

	/* Store */
	STORE_TITLE: 'Store',
	
	/* Info */
	INFO_TITLE: 'About userportal', 
	INFO_INTRO: '<p>The <strong>Yucca Platform</strong>is entirely created using <strong>Open Source</strong> technologies</p><p>Source code is available on github <a href="https://github.com/csipiemonte" target="_blank">github.com/csipiemonte</a>',
	INFO_MAIN_FRAMEWORK_TITLE: 'Created with',
	INFO_LIBRARIES_TITLE: 'Presentation and libraries',
	INFO_SOURCE_TOOL_TITLE: 'Source code and build tools',

};
