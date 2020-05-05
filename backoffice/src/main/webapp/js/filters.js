/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

'use strict';

/* Filters */
var appFilters  = angular.module('backoffice.filters', []);

appFilters.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);


appFilters.filter('clearNil', function() {
	return function(input) {
		if (input) {
			if(typeof(input) === 'object' && input !=null && input["@nil"]){
	    		return "";
	    	}
	        return input;
	    }
	};
});


appFilters.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return (input && input!=null) ? input.slice(start) : [];
    };
});

appFilters.filter('number_ellipse', function() {
	return function(input, min, max) {
		var output = input;
		if (input && Helpers.util.isNumber(input)) {
			if(Math.abs(input)<min)
				output ="<" + min; 
			else if(Math.abs(input)>1000)
				output =">" + max; 
			else
				output = input.toFixed(2);
	    }
		return output;
	};
});

appFilters.filter('string_ellipse', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (text === undefined || text == null)
        	text = "";

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }
    };
});



appFilters.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


appFilters.filter('format_filesize', function() {
	return function(input) {
		var output = "";
		if (input) {
			input=Math.trunc(input);
			if(input<1000)
				output=input+"byte";
			else if(input<1000000)
				output=(input/1000).toFixed(1)+"Kb";
			else if(input<1000000000)
				output=(input/1000000).toFixed(1)+"Mb";
			else if(input<1000000000000)
				output=(input/1000000000).toFixed(1)+"Gb";
	    }
		return output;
	};
});

appFilters.filter('format_big_number', function() {
	return function(input) {
		var output = "";
		if (input) {
			input=Math.trunc(input);
			if(input<1000)
				output=input;
			else if(input<1000000)
				output=(input/1000).toFixed(2)+" <span class='counter-group'>mila</span>";
			else if(input<1000000000)
				output=(input/1000000).toFixed(2)+" <span class='counter-group'>mln</span>";
			else if(input<1000000000000)
				output=(input/1000000000).toFixed(2)+" <span class='counter-group'>mld</span>";
	    }
		return (""+output).replace(".", ","); 
	};
});

appFilters.filter('nvl', function() {
	return function(input, ifNull) {
		var output = input;
		if (!input || input ==null) {
			output = ifNull;
	    }
		return output;
	};
});

appFilters.filter('booleanToString', function() {
	return function(input) {
		var output = 'NO';
		if (input!=null && (input===1 || input==1 || input == 'true'||input === true))
			output = 'YES';
		return output;
	};
});

appFilters.filter('tagFromId', function() {
	return function(tagId, tagMap) {
		var tag = null;
		if ((typeof tagId != "undefined") && tagId !=null && (typeof tagMap != "undefined") && tagMap !=null) {
			tag = tagMap[tagId];
		}
		return tag;
	};
});

appFilters.filter('guessForegroundColor', function() {
	return function(bgHex) {
      bgHex = String(bgHex).replace(/[^0-9a-f]/gi, '');
      if (bgHex.length < 6) {
        bgHex = bgHex[0] + bgHex[0] + bgHex[1] + bgHex[1] + bgHex[2] + bgHex[2];
      }
      var rgb = parseInt(bgHex, 16);   // convert rrggbb to decimal
    	var r = (rgb >> 16) & 0xff;  // extract red
    	var g = (rgb >>  8) & 0xff;  // extract green
    	var b = (rgb >>  0) & 0xff;  // extract blue

    	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    	return luma > 164?"#000":"#fff";
	};
});
