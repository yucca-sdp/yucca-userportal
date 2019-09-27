'use strict';

/* Filters */
var appFilters  = angular.module('userportal.filters', []);

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


appFilters.filter('smartobject_date_format', function() {
	return function(input) {
		if (input && input.length==8) {
			return new Date(input.substring(0,4), input.substring(4,6)-1, input.substring(6,8)).format("dd/mm/yyyy");
	    }
		else
			return "";
	};
});

appFilters.filter('dataset_date_format', function() {
	return function(input) {
		if (input && input.length==8) {
			return new Date(input.substring(0,4), input.substring(4,6)-1, input.substring(6,8)).format("dd/mm/yyyy");
	    }
		else
			return "";
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

// remove with new admin api
//appFilters.filter('subDomainFilter', function () {
//    return function (subDomainList, domain) {
//    	var subDomainFilteredList = [];
//    	angular.forEach(subDomainList, function(val, key) {
//    		if ((val.codDomain == domain) && (val.deprecated == 0)){
//    			this.push(val.codSubDomain);
//    		}
//    	}, subDomainFilteredList);
//    	return subDomainFilteredList;
//    };
//});

appFilters.filter('string_ellipse', function () {
    return function (text, length, end) {
    	
    	if(typeof text === "undefined"  || text == null)
    		text = "";
    	
        if (isNaN(length))
            length = 10;

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


appFilters.filter('millisFormatted', function() {
    return function(millis) {
    	var dateOut = "";
    	if(millis && millis!=null){
    		var dateIn = new Date(millis);
    		dateOut  = dateIn.format("dd/mm/yyyy HH:MM");
    	}
        return dateOut;
    };
});

appFilters.filter('datetimeFormatted', function() {
    return function(dateIn) {
    	var dateOut = "";
    	if(dateIn && dateIn!=null)
    		dateOut  = dateIn.format("dd/mm/yyyy HH:MM");
        return dateOut;
    };
});

appFilters.filter('dateFormatted', function() {
    return function(dateIn) {
    	var dateOut = "";
    	if(dateIn && dateIn!=null)
    		dateOut  = dateIn.format("dd/mm/yyyy");
        return dateOut;
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

appFilters.filter('format_time_from_seconds', function() {
	return function(input) {
		var output = "";
		if (input) {
   	 	var sec_num = parseInt(input);
   	 	var hours   = Math.floor(sec_num / 3600);
  		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  		var seconds = sec_num - (hours * 3600) - (minutes * 60);
      	
	    if(hours>0)
	        output += hours+"h "; 
				if(minutes>0)
	        output += minutes+"m "; 
				if(seconds>0 )
	        output += seconds+"s "; 
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

appFilters.filter('prettifyTweet', function() {
	return function(input) {
		var output = input;
		if ((typeof input != "undefined") && input !=null) {
			output = Helpers.render.prettifyTwitterMessage(input);
			output = output.toString();
	    }
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

appFilters.filter('decodeFromId', function() {
	return function(decodeId, decodes, decodeIdPropName) {
		var decode = null;
		if ((typeof decodes != "undefined") && decodes !=null && (typeof decodeId != "undefined") && decodeId !=null && (typeof decodeIdPropName != "undefined") && decodeIdPropName !=null) {
			for (var dIndex = 0; dIndex < decodes.length; dIndex++) {
				if(decodeId == decodes[dIndex][decodeIdPropName]){
					decode  = decodes[dIndex];
					break;
				}
			}
		}
		return decode ;
	};
});

appFilters.filter('decodeLicense', function() {
	return function(idLicense) {
		var licenseDesc = "";
		if (typeof idLicense != "undefined" && idLicense !=null ) {
			switch (idLicense) {
				case Constants.LICENSE_CC0_ID:
					licenseDesc = Constants.STREAM_FIELD_METADATA_LICENSE_CC0;
					break;
				case Constants.LICENSE_CCBY_ID:
					licenseDesc = Constants.STREAM_FIELD_METADATA_LICENSE_CCBY;
					break;
	
				default:
					licenseDesc = "";
					break;
				}
		}
		return licenseDesc ;
	};
});

appFilters.filter('translateDecode', function() {
	return function(decode, lang) {
		var translate = "";
		if(typeof lang == "undefined" || lang == null) 
			lang = "it";
		if (typeof decode != "undefined"){
			for (var property in decode) {
			    if (decode.hasOwnProperty(property)) {
			        if(property.toLowerCase() == "lang"+lang.toLowerCase()){
			        	translate = decode[property];
			        	break;
			        }
			    }
			}
		} 
		return translate;
	};
});


//appFilters.filter('measureUnitFromId', function() {
//	return function(measureUnitId, measureUnitMap) {
//		console.log("measureUnitFromId",measureUnitId, measureUnitMap);
//		var measureUnit = null;
//		if ((typeof measureUnitMap != "undefined") && measureUnitMap !=null && (typeof measureUnitMap != "undefined") && measureUnitMap !=null) {
//			measureUnit = measureUnitMap[measureUnitId];
//		
//		}
//		console.log("measureUnit",measureUnit);
//
//		return measureUnit;
//	};
//});