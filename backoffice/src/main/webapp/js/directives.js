/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

'use strict';

/* Directives */
var appDirectives = angular.module('backoffice.directives', []);

appDirectives.directive('appVersion', [ 'version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
} ]);

appDirectives.directive('mainNavbar', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainNavbarProfile', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar-profile.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainFooter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-footer.html?'+BuildInfo.timestamp,
	};
});
//
//appDirectives.directive('manageStreams', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/manage/streams.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('manageDatasets', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/manage/datasets.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('manageTenants', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/manage/tenants.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('manageUsers', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/manage/users.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('manageImport', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/manage/import.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('jobsPromotion', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/jobs/promotion.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('jobsBulk', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/jobs/bulk.html?&t='+BuildInfo.timestamp,
//	};
//});
//
//appDirectives.directive('jobsBulk', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/jobs/bulk.html?&t='+BuildInfo.timestamp,
//	};
//});


appDirectives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


appDirectives.directive('scrollOnClick', function() {
	return {
	    restrict: 'A',
	    link: function(scope, $elm, attrs) {
	    	var idToScroll = attrs.href;
	    	console.log("idToScroll",idToScroll);
	    	$elm.on('click', function() {
	    		var $target;
	    		if (idToScroll && idToScroll!='javascript:void(0)') {
	    			$target = $(idToScroll);
	    		} else {
	    			$target = $elm;
	    		}
	    		console.debug("target ",$target);
	    		$("body").animate({scrollTop: $target.offset().top}, "slow");
	    	});
	    }
	 };
});



