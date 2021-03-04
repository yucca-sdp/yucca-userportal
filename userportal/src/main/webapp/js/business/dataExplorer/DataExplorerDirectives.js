/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Directives */

appDirectives.directive('dataexplorerSidebarFilter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/dataexplorer/sidebar-filter.html?t='+BuildInfo.timestamp,
	};
});


appDirectives.directive('dataexplorerSidebarMetadatadetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/dataexplorer/sidebar-metadata-detail.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserDomains', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/domains.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserTags', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/tags.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('databrowserResults', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dataexplorer/databrowser/results.html?t='+BuildInfo.timestamp,
	};
});

