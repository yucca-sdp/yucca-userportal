/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '2.1.1');

appServices.factory('readFilePreview', function($q) {
	return {
		readTextFile: function (file, previewSize, encoding) {
			var deferread = $q.defer();
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				console.log("file", file);
				if ((file !== undefined) && (file !== null)) {
					reader.onload = function (event) {

						deferread.resolve(event.target.result);
					};
					var firstBytes = file.slice(0, previewSize + 1);
					reader.readAsText(firstBytes, encoding);
				}else{
					console.log("reject", file);
					deferread.reject("You need to pass a file.");
				}
			}else{
				deferread.reject("Your browser don't support File api.");
			}

			return deferread.promise;
		},
		readImageFile: function (file) {
			var deferread = $q.defer();
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				console.log("file", file);
				if ((file !== undefined) && (file !== null)) {
					reader.onload = function (event) {
						deferread.resolve(event.target.result);
					};
					reader.readAsDataURL(file);
				}else{
					console.log("reject", file);
					deferread.reject("You need to pass a file.");
				}
			}else{
				deferread.reject("Your browser don't support File api.");
			}

			return deferread.promise;
		}
		
	};
});


appServices.factory('sharedDatasource',  function () {
	var datasource = null;
	
	return {
		getDatasource: function () { return datasource;},
		setDatasource: function(value) {datasource = value;}
	};
});

/*

appServices.factory('sharedStream',  function () {
	var stream = null;
	
	return {
		getStream: function () {
			return stream;
		},
		setStream: function(value) {
			stream = value;
		}
	};
});

appServices.factory('sharedDataset',  function () {
	var dataset = null;
	
	return {
		getDataset: function () {
			return dataset;
		},
		setDataset: function(value) {
			dataset = value;
		}
	};
});
*/

appServices.factory('sharedAdminResponse',  function () {
	var response = null;
	
	return {
		getResponse: function () {
			var tmpResponse = angular.copy(response);
			response = null;
			return tmpResponse;
		},
		setResponse: function(value) {
			response = value;
		}
	};
});


appServices.factory('dataexplorerBrowseData',  function () {
	var searchResult = null;
	
	return {
		getSearchResult: function () {
			return searchResult;
		},
		setSearchResult: function(value) {
			searchResult = value;
		}
	};
});


appServices.factory('dataexplorerService',  function () {
	var searchInput = null;
	
	return {
		getSearchInput: function () {
			return searchInput;
		},
		setSearchInput: function(value) {
			searchInput = value;
		}
	};
});



appServices.factory('sharedUploadBulkErrors',  function () {
	var errors = null;
	
	return {
		getErrors: function () {
			return errors;
		},
		setErrors: function(value) {
			errors = value;
		}
	};
});


appServices.factory('devService', function($q) {
	return {
		fakeHttpCall : function(isSuccessful, result) {
		
			var deferred = $q.defer();
		
			setTimeout(function() {
			    if (isSuccessful === true) {
			    	if(typeof result == 'undefined')
			    		result = "Successfully resolved the fake $http call";
			        deferred.resolve(result);
			    }
			    else {
			    	if(typeof result == 'undefined')
			    		result = "Oh no! Something went terribly wrong in you fake $http call";
			        deferred.reject(result);
			    }
			}, 200 );
		
		   return deferred.promise;
		}
	};
});


app.factory('idleTimer',  function($rootScope, $timeout) {
	var idleTimer = null;
	var idleTimerService = {};
	
	idleTimerService.startTimer = function () {
        console.debug('Starting timer');
        this.idleTimer = $timeout(this.timerExpiring, 840000); // 14 minutes
     };
    
    idleTimerService.stopTimer = function () {
        if (this.idleTimer) {
            console.debug('stopTimer timer');

            $timeout.cancel(this.idleTimer);
        }
    };
    
    idleTimerService.resetTimer = function () {
        this.stopTimer();
        this.startTimer();
    };
    
    idleTimerService.timerExpiring = function () {
        //this.stopTimer();
        $rootScope.$broadcast('sessionExpiring');
        console.debug('Timer expiring ..');
    };
 
    //startTimer();
 
    return idleTimerService;
});




