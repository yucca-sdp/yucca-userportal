/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */


appControllers.controller('DataSearchDemoCtrl', [ '$scope', '$routeParams',  '$location', '$filter', '$http',  'info', 'dataexplorerService', 'metadataapiAPIservice','$translate','$timeout',
                                                function($scope, $routeParams,  $location, $filter,  $http, info,dataexplorerService, metadataapiAPIservice,$translate,$timeout) {
	
	$scope.domainList = [];
	$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};
	
	$scope.treeListData =  [{"name": "Data Lake", "parent": "null", "cssClass": "", "children": [], "filter":{}}];
	
	
	var domainIconMap = {};
	
	domainIconMap["TRADE"] = "\ue800";
	domainIconMap["TRANSPORT"] = "\ue801";
	domainIconMap["CULTURE"] = "\ue802"; 
	domainIconMap["ECONOMY_FINANCES_TAXES"] = "\ue803"; 
	domainIconMap["AGRICULTURE"] = "\ue804"; 
	domainIconMap["EMPLOYMENT_TRAINING"] = "\ue805"; 
	domainIconMap["ENERGY"] = "\ue806"; 
	domainIconMap["ENVIRONMENT"] = "\ue807"; 
	domainIconMap["GOVERNMENT"] = "\ue808"; 
	domainIconMap["HEALTH"] = "\ue809"; 
	domainIconMap["POPULATION_SOCIAL_ISSUE"] = "\ue80a"; 
	domainIconMap["PRODUCTION"] = "\ue80b"; 
	domainIconMap["SCHOOL"] = "\ue80c";
	domainIconMap["SCIENCE_TECHNOLOGY"] = "\ue80d"; 
	domainIconMap["SECURITY"] = "\ue80e"; 
	domainIconMap["SMART_COMMUNITY"] = "\ue80f";
	domainIconMap["TERRITORY"] = "\ue810"; 
	domainIconMap["TOURISM_SPORT"] = "\ue811"; 
	
	var getDomainIcon = function(domainKey){
		return typeof domainIconMap[domainKey]!= 'undefined'?domainIconMap[domainKey]:"";
	};
	
	var camelize = function (str) {
		if(str && str!=null)
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		else
			return "";
	};

	var addPivotToTree = function(tree, pivotList, prevFilter){
		if(typeof tree.children == 'undefined' || tree.children==null)
			tree.children = [];
		for (var pivotListIndex = 0; pivotListIndex < pivotList.length; pivotListIndex++) {
			pivot = pivotList[pivotListIndex];
			var filter = {};
			for (var property in prevFilter) {
			    if (prevFilter.hasOwnProperty(property)) {
			    	filter[property] = prevFilter[property];
			    }
			}
			filter[pivot.field] = pivot.value;
			var icon = "";
			var cssIcon = "";
			var cssClass = "";

			if(pivot.field=="domainCode"){
				icon = getDomainIcon(pivot.value.toUpperCase());
				cssIcon = "domain-icon";
				cssClass = "domain";
			}
			var child = {"name": camelize($translate.instant(pivot.value.toUpperCase())), "count": pivot.count, "parent": tree.name, "cssClass": cssClass, "icon": icon, "cssIcon": cssIcon, 
					"filter": filter, "field": pivot.field, "value": pivot.value,
					search: function(filter){
						console.log("search - filter",filter);
						$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};
						for (var property in filter) {
						    if (filter.hasOwnProperty(property)) {
						    	$scope.metadataSearchInput.filter[property] = [filter[property]];
						    }
						}
						console.log("search - metadataSearchInput", $scope.metadataSearchInput);
						dataexplorerService.setSearchInput($scope.metadataSearchInput);
						 $scope.$apply(function() {
							 $location.path('dataexplorer/searchresults').search();
						 });
					} 
			};
			
			if(typeof pivot.pivot != 'undefined'  && pivot.pivot!=null)
				addPivotToTree(child, pivot.pivot,filter);
			tree.children.push(child);
		}
	};
	
	
	var sortChildren = function(tree){
		if(typeof tree.children != 'undefined'){
			tree.children.sort(
				function(a,b) {
					if (a.name < b.name)
						return -1;
					if (a.name > b.name)
						return 1;
					return 0;
				});
		
			for (var cIndex = 0; cIndex < tree.children.length; cIndex++) {
				sortChildren(tree.children[cIndex].children);
				
			}
		}
	};

	$scope.forceDirectedData = new Array();
	
	var prepareForceDirectedData  = function(treeData, recursive){
		//console.log("prepareForceDirectedData", treeData);
		for (var childrenIndex = 0; childrenIndex < treeData.children.length; childrenIndex++) {
			child = treeData.children[childrenIndex];
			//console.log("prepareForceDirectedData child", child);
			
			if(typeof child.children != 'undefined'  && child.children!=null){
				for (var childPivotIndex = 0; childPivotIndex < child.children.length; childPivotIndex++) {
					var childPivot = child.children[childPivotIndex];
	
				//	console.log("childPivot",childPivot);
					var forceItem = {"source": child.name, 
							"sourceType":child.field, 
							"target" :childPivot.name,
							"targetType":childPivot.field, 
							"type":"Main",
							"count": child.count, 
							"cssClass": child.cssClass, 
							"icon": child.icon, 
							"cssIcon": child.cssIcon, 
							"filter": child.filter,
							"search": function(filter){
									console.log("search - filter",filter);
									$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};
									for (var property in filter) {
									    if (filter.hasOwnProperty(property)) {
									    	$scope.metadataSearchInput.filter[property] = [filter[property]];
									    }
									}
									console.log("search - metadataSearchInput", $scope.metadataSearchInput);
									dataexplorerService.setSearchInput($scope.metadataSearchInput);
									 $scope.$apply(function() {
										 $location.path('dataexplorer/searchresults').search();
									 });
								} 
							};
					$scope.forceDirectedData.push(forceItem);
					if(typeof childPivot.children != 'undefined'  && childPivot.children!=null)
						prepareForceDirectedData(child, child.filter);

				}
			}		
		}
		
	};
	
	var prepareForceDirectedData_old  = function(pivotList, prevFilter){
		console.log("prepareForceDirectedData", pivotList);
		for (var pivotListIndex = 0; pivotListIndex < pivotList.length; pivotListIndex++) {
			pivot = pivotList[pivotListIndex];
			if(typeof pivot.pivot != 'undefined'  && pivot.pivot!=null){
				var filter = {};
				for (var property in prevFilter) {
				    if (prevFilter.hasOwnProperty(property)) {
				    	filter[property] = prevFilter[property];
				    }
				}
				filter[pivot.field] = pivot.value;
				var icon = "";
				var cssIcon = "";
				var cssClass = "";
	
				if(pivot.field=="domainCode"){
					icon = getDomainIcon(pivot.value.toUpperCase());
					cssIcon = "domain-icon";
					cssClass = "domain";
				}
				for (var childPivotIndex = 0; childPivotIndex < pivot.pivot.length; childPivotIndex++) {
					var childPivot = pivot.pivot[childPivotIndex];
	
			
					var forceItem = {"source": camelize($translate.instant(pivot.value.toUpperCase())), 
							"sourceType":pivot.field, 
							"target" :camelize($translate.instant(childPivot.value.toUpperCase())),
							"targetType":childPivot.field, 
							"type":"Main",
							"count": pivot.count, 
							"cssClass": cssClass, 
							"icon": icon, 
							"cssIcon": cssIcon, 
							"filter": filter,
							"search": function(filter){
									console.log("search - filter",filter);
									$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};
									for (var property in filter) {
									    if (filter.hasOwnProperty(property)) {
									    	$scope.metadataSearchInput.filter[property] = [filter[property]];
									    }
									}
									console.log("search - metadataSearchInput", $scope.metadataSearchInput);
									dataexplorerService.setSearchInput($scope.metadataSearchInput);
									 $scope.$apply(function() {
										 $location.path('dataexplorer/searchresults').search();
									 });
								} 
							};
					$scope.forceDirectedData.push(forceItem);
					if(typeof childPivot.pivot != 'undefined'  && childPivot.pivot!=null)
						prepareForceDirectedData(pivot.pivot, filter);

				}
			}		
		}
		
	};
	
	$scope.treeListDataReady = false;
	var browseForceNavigationInit = false;
	$scope.browseForceNavigationDelta = 0;
	
	
	
	
	var emptyPagination = {"start": "0", "rows":"0"};
	
	
	
	var browseForceNavigationInitBack = false;
	var metadataPivotSearch  = function(pivotFacetFields, filter){

		var pivotFacet = {"pivot": pivotFacetFields};
		$scope.treeListData =  [{"name": "Data Lake", "parent": "null", "cssClass": "datalake", "children": [], "filter":{}}];

		$scope.netflixData = {"name": "Data Lake", "parent": "null", "cssClass": "datalake", "children": [], "filter":{}};
		
		$scope.forceDirectedData = new Array();
		console.log("metadataPivotSearch", pivotFacet);
		$scope.treeListDataReady = false;
		metadataapiAPIservice.search(null,null, null, emptyPagination,filter, null, pivotFacet).success(function(response) {
			console.log("metadataapiAPIservice.domainSubdomainFacet _ response", response);
			var domainSubdomainPivot = response.facetCount.facetPivotList[pivotFacetFields];
			console.log("tree data",$scope.treeListData[0]);
			addPivotToTree($scope.treeListData[0], domainSubdomainPivot,{});
			addPivotToTree($scope.netflixData, domainSubdomainPivot,{});
			sortChildren($scope.treeListData[0]);
			sortChildren($scope.netflixData);
			
			prepareForceDirectedData($scope.netflixData);
			console.log("force data", $scope.forceDirectedData);
			$scope.treeListDataReady = true;

			if($scope.demoType=='force'){
				if(!browseForceNavigationInit)
					initBrowseForceNavigation();
				else
					browseForceDirectedCallback();
				}

		});

	};
	
	//$scope.demoType='force';
	$scope.chooseDemo = function(type){
		console.log("treeListData",$scope.treeListData);
		$scope.demoType = type;
//		if($scope.demoType=='force')
//			$scope.browseByDomainNoSubdomain();
//		else
			$scope.browseByDomain();
	};
	
	$scope.browseBy = 'domain';
	$scope.browseByDomain = function(){
		$scope.browseBy = 'domain';
		
		if($scope.demoType=='force'){
			browseForceNavigationInit = false;
			$scope.browseForceTitle = "Naviga per categorie";
			metadataPivotSearch("domainCode,organizationCode");
		}else{
			metadataPivotSearch("domainCode,subdomainCode,organizationCode");
		}
	};
	
	$scope.browseByOrganization = function(){
		$scope.browseBy = 'organization';
		if($scope.demoType=='force'){
			browseForceNavigationInit = false;
			$scope.browseForceTitle = "Naviga per organizzazioni";
			metadataPivotSearch("organizationCode,domainCode");
		}else{
			metadataPivotSearch("organizationCode,domainCode,subdomainCode");
		}
	};
	
//	$scope.browseByDomainNoSubdomain = function(){
//		$scope.browseBy = 'noSubdomain';
//		metadataPivotSearch("domainCode,organizationCode");
//	};
//	
	$scope.chooseDemo('netflix');

	$scope.netflixRowDelta = {};
	$scope.scrollNetflixRow = function(rowId, direction){
		console.log("scrollNetflixRow", rowId);
		if(typeof $scope.netflixRowDelta[rowId]=='undefined')
			$scope.netflixRowDelta[rowId] = direction*280;
		else
			$scope.netflixRowDelta[rowId] += direction*280;
		
		var delta = $scope.netflixRowDelta[rowId];
		angular.element("#netflix_row_"+rowId).css({"transform": "translateX("+delta+"px)"});
		console.log("$scope.netflixRowDelta[rowId]",$scope.netflixRowDelta[rowId]);
	};
	
	$scope.searchFromNetflix = function(item){
		console.log("searchFromNetflix - item",item);
		$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};
		for (var property in item.filter) {
		    if (item.filter.hasOwnProperty(property)) {
		    	$scope.metadataSearchInput.filter[property] = [item.filter[property]];
		    }
		}
		console.log("searchFromNetflix - metadataSearchInput", $scope.metadataSearchInput);
		dataexplorerService.setSearchInput($scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search();
	
	};
	
	

	$scope.forceHorizontalNavigationChilds = [];
	
	$scope.browseForceHistory = [null];
	$scope.browseForceTitle = "Naviga per categorie";
	
	$scope.browseForceDirected = function(item, back){
		console.log("browseForceDirected",item);
		
		browseForceNavigationInitBack = back;
		
		if(back){
			$scope.browseForceHistory.pop();
			item = $scope.browseForceHistory.pop();
		}
		$scope.browseForceHistory.push(item);

		if(typeof item == 'undefined' || item == null){
			$scope.browseForceTitle = "Naviga per categorie";
			if($scope.browseBy == 'domain')	
				metadataPivotSearch("domainCode,organizationCode", null);
			else
				metadataPivotSearch("organizationCode,domainCode", null);
		}
		else if(item.field == 'domainCode'){
			$scope.browseForceTitle = item.name;
			if($scope.browseBy == 'domain')	
				metadataPivotSearch("subdomainCode,organizationCode", {"domainCode": [item.value]});
			else
				metadataPivotSearch("organizationCode,subdomainCode", {"domainCode": [item.value]});
		}
		else if(item.field == 'subdomainCode'){
			$scope.browseForceTitle = item.name;
			if($scope.browseBy == 'domain')	
				metadataPivotSearch("subdomainCode,organizationCode", {"subdomainCode": [item.value]});
			else
				metadataPivotSearch("organizationCode, subdomainCode", {"subdomainCode": [item.value]});
		}
		else if(item.field == 'organizationCode'){
			$scope.browseForceTitle = item.name;
			if($scope.browseBy == 'domain')	
				metadataPivotSearch("subdomainCode,organizationCode", {"organizationCode": [item.value]});
			else
				metadataPivotSearch("organizationCode,subdomainCode", {"organizationCode": [item.value]});
		}
		

	};

	
	
	var initBrowseForceNavigation = function(){
		$scope.forceHorizontalNavigationChilds = [];
		$scope.forceHorizontalNavigationChilds.push($scope.netflixData);

		$scope.browseForceNavigationDelta = angular.element("#browseForceHorizontalTitle")[0].clientWidth; 
		var browseForceNavigationHeight = angular.element("#browseForceHorizontalTitle")[0].clientHeight; 
		angular.element(".browseForceHorizontalRow").css({"min-heigth": browseForceNavigationHeight+"px"});
		browseForceNavigationInit = true;

	};
	
	

	var browseForceDirectedCallback = function(){
		console.log("$scope.browseForceNavigationDelta", $scope.browseForceNavigationDelta);
		angular.element(".browseForceHorizontalPanel").css({"width": $scope.browseForceNavigationDelta+"px"});
		
		var translateX = -1*$scope.browseForceNavigationDelta*($scope.forceHorizontalNavigationChilds.length-1);
		if(!browseForceNavigationInitBack){
			$scope.forceHorizontalNavigationChilds.push($scope.netflixData);
			translateX = -1*$scope.browseForceNavigationDelta*($scope.forceHorizontalNavigationChilds.length-1);
		}
		else{
			translateX = -1*$scope.browseForceNavigationDelta*($scope.forceHorizontalNavigationChilds.length-2);
			$timeout(function(){$scope.forceHorizontalNavigationChilds.splice(-1,1);}, 1000);
		}
		
		
		angular.element(".browseForceHorizontalRow").css({"width": $scope.browseForceNavigationDelta*($scope.forceHorizontalNavigationChilds.length) +"px"});
		angular.element(".browseForceHorizontalRow").css({"transform": "translateX("+translateX+"px)"});
		//angular.element(".force-row-item").css({"width": $scope.browseForceNavigationDelta +"px"});
	};
	
	$scope.search = function(selectedDomain){
		console.log("search", selectedDomain);
		if(typeof selectedDomain!= 'undefined' && selectedDomain!=null)
			$scope.metadataSearchInput.filter.domainCode = [selectedDomain];
		console.log("search - metadataSearchInput", $scope.metadataSearchInput);
		dataexplorerService.setSearchInput($scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search({query:$scope.metadataSearchInput.query});
	};
	
}]);



