/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Directives */
var appDirectives = angular.module('userportal.directives', []);

appDirectives.directive('appVersion', [ 'version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
} ]);

appDirectives.directive('mainNavbar', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainNavbar2', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar2.html?t='+BuildInfo.timestamp,
	};
});

//appDirectives.directive('homeHeader', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/common/home-header.html?t='+BuildInfo.timestamp,
//	};
//}); 

appDirectives.directive('mainNavbarProfile', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar-profile.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainNavbarProfile2', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar-profile2.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainFooter', function(YUCCA_PORTAL) {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-footer-'+YUCCA_PORTAL+'.html?t='+BuildInfo.timestamp,
	};
});


appDirectives.directive('usedLang', function updateLanguage( $rootScope ) {
    return {
        link: function( scope, element ) {
          var listener = function( event, translationResp ) {
            var defaultLang = "it",
                currentlang = translationResp.language;

            element.attr("lang", currentlang || defaultLang );
          };

          $rootScope.$on('$translateChangeSuccess', listener);
        }
     };
});

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

appDirectives.directive('ngConfirmClick', function(){
	return {
		priority: -1,
		restrict: 'A',
		link: function(scope, element, attrs){
			element.bind('click', function(e){
				var message = attrs.ngConfirmClick;
				if(message && !confirm(message)){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
			});
		}
	};
 });

appDirectives.directive('iframeOnload', [function(){
	return {
	    scope: {
	        callBack: '&iframeOnload'
	    },
	    link: function(scope, element, attrs){
	        element.on('load', function(){
	        	console.log("iframeOnload");
	            return scope.callBack();
	        });
	    }
	};
}]);



appDirectives.directive('alertPanel', [function(){
	return {
	  restrict: 'E',
	  template: '<div class="alert alert-{{content.type}}" ng-if="content.message!=null">'+
	  			'  <div class="alert-close-link" href ng-click="hide()">&times</div>'+
	  			'  <strong>{{content.message|translate}}</strong>'+
				'  <div> <span ng-if="content.code">Code: {{content.code}} - </span> <span ng-if="content.detail">{{content.detail}}</span></div>'+
				'  <div ng-if="content.details" ng-repeat="d in content.details track by $index">&hybull; {{d|translate}}</div>'+
				'</div>',
	  scope: {
		content: '=?',
		type: '@',
	    code: '@',
	    message: '@',
	    detail: '@',
	    details: '='
	  },
	  link: function(scope, element, attrs){
		  //scope.content = scope.content;
		  if(!scope.content){
			  scope.content = {type: scope.type,
					   code: scope.code,
					    message: scope.message,
					    detail: scope.detail,
					    details: scope.details
					  };
		  }

		  //scope.details = scope.details;
          scope.hide = function(){
        	scope.content.message=null;  
          };
      }
	};
}]);

appDirectives.directive('helpButton', ['$modal',function($modal){
	return {
	  restrict: 'E',
	  template: '<a href class="help-button  {{css}}" ng-click="openHelp()"><i class="fa fa-question-circle"></i></a>',
	  scope: {
		helptitle: '@',
		section: '@',
		page: '@',
		css: '@',
		size: '@',
	  },
	  link: function(scope, element, attrs){
		  if(typeof scope.size == 'undefined' || scope.size == null)
			  scope.size = 'md';
		  scope.openHelp = function(){
			  $modal.open({
				animation : true,
				size: scope.size,
				templateUrl : 'helpDialog.html',
				controller : 'HelpDialogCtrl',
				backdrop  : 'static',
				resolve: { 
					help: function () {return {"title": scope.helptitle, "section":scope.section,"page":scope.page};}
				}
			});
		  }
		  
      }
	};
}]);



appDirectives.directive('colorPicker', [function(){
	return {
		  restrict: 'E',
		  template: '<div class="input-group color-picker {{css}}" >'+
		    '  <input type="color"    ng-model="color" class="form-control " ng-disabled="isdisabled"> '+
  			'  <div class="input-group-btn" dropdown> '+
			'    <button type="button" class="btn dropdown-toggle" dropdown-toggle ng-disabled="isdisabled">'+
  			'  	   <span class="caret"></span>'+
  			'    </button>'+
  			'    <ul class="dropdown-menu" role="menu">'+
  			'      <li ng-repeat="line in defaultColors track by $index">'+
  			'        <div class="default-color-box" ng-repeat="c in line track by $index" style="background-color: {{c}}" ng-click="selectColor(c)"></div>' + 
  			'      </li>'+
  			'    </ul>'+
  			'  </div>'+
  			'</div>',
		  scope: {
			color: '=?',
			css: '@',
			isdisabled: '=',
		  },
		  link: function(scope, element, attrs){
			  console.log("colorPicker",scope.color, scope.css,scope.isdisabled);
			  
			 var randomColor = function(){
				 var line = Math.floor(Math.random()*scope.defaultColors.length);
				 var c = Math.floor(Math.random()*3);
				 scope.color= scope.defaultColors[line][c];
			 };

			 scope.defaultColors = [["#fce94f","#edd400","#c4a000"],
				 ["#fcaf3e","#f57900","#ce5c00"],
				 ["#e9b96e","#c17d11","#8f5902"],
				 ["#8ae234","#73d216","#4e9a06"],
				 ["#729fcf","#3465a3","#204a87"],
				 ["#ad7fa8","#75507b","#5c3566"],
				 ["#ef2929","#cc0000","#a40000"]];
//				 ["#eeeeec","#d3d7cf","#babdb6"],
//				 ["#888a85","#555753","#2e3436"]];
			 
			 scope.defaultColors2 = [["#19aeff","#0047c8","#005c94"],
				 ["#ccff42","#9ade00","#009100"],
				 ["#ffff3e","#ff9900","#ff6600"],
				 ["#eccd84","#d49725","#804d00"],
				 ["#ff4141","#dc0000","#b50000"],
				 ["#f1caff","#d76cff","#ba00ff"],
				 ["#9eabb0","#364e59","#0e232e"],
				 ["#cccccc","#999999","#666666"]];
			 
			 scope.defaultColors1 = [["#9e4d44","#f7786b","#fbc1bb"],
				 ["#5d6c85","#91a8d0","#ccd7e9"],
				 ["#023354","#034f84","#8baec6"],
				 ["#a08f26","#fae03c","#fdf1a5"],
				 ["#618d8e","#98ddde","#d0eff0"],
				 ["#616069","#9896a4","#d0cfd5"],
				 ["#8d2a20","#dd4132","#efa8a1"],
				 ["#715c44","#b18f6a","#dbccbb"],
				 ["#4d7f35","#79c753","#c1e5b0"]];

			 if(typeof scope.color == 'undefined' || scope.color == null){
				 randomColor();
			 }
			 
			 scope.$watch('isdisabled', function(newVal, oldVal){
				 console.log("isdisabled",newVal, oldVal);
			        if(oldVal && !newVal)
						 randomColor();
			    });
			 
			 scope.selectColor = function(color){
				 scope.color = color;
			 }
	      }
		};
	}]);

//appDirectives.directive('inputWithHtmlHint', function(){
//	  return {
//	    require: "?ngModel",
//	    scope: true,
//		restrict : 'E',
//	    link: function(scope, element, attrs, ngModel){
//	      if (!ngModel) return;
//
//	      scope.onChange = function(){
//	        ngModel.$setViewValue(scope.value);
//	      };
//
//	      ngModel.$render = function(){
//	        scope.value = ngModel.$modelValue;
//	      };
//	    },
//	    template: '<div class="input-group input-group-sm " >' +  
//				  '  <input class="input-sm form-control" type="text" name="'+inputName+'" ng-model="newField.dateTimeFormat" >
//												<span class="input-group-addon" tooltip-html-unsafe="{{htmlTooltip}}" tooltip-trigger="click">&quest;</span>
//											</div>"
//	  };
//});

