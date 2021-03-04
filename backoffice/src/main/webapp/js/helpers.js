/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

var Helpers = Helpers || {};

Helpers.stream = {
	wsOutputUrl : function(stream) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var virtualentity_stream = "";

		if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity) && !Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream = stream.codiceVirtualEntity + "_" + stream.codiceStream;
		else if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity))
			virtualentity_stream = stream.codiceVirtualEntity;
		else if (!Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream += stream.codiceStream;

		var result = "/topic/output." + stream.codiceTenant + "." + virtualentity_stream;
		return result;
	},
	wsStatUrl : function(stream) {
		var result = Helpers.stream.wsOutputUrl(stream) + ".stat";
		return result;
	},
	wsErrorUrl : function(stream) {
		var result = Helpers.stream.wsOutputUrl(stream) + ".errors";
		return result;
	},
	statusIcon : function(stream) {
		var icon = "";
		if (stream.status.statuscode) {
			var cssClass = "";
			switch (stream.status.statuscode) {
			case "draft":
				cssClass = "glyphicon-pencil action-edit";
				break;
			case "req_inst":
				cssClass = "glyphicon-cog action-request-installation";
				break;
			case "inst":
				cssClass = "glyphicon-save action-install";
				break;
			case "req_uninst":
				cssClass = "glyphicon-cog action-uninstall";
				break;
			case "uninst":
				cssClass = "glyphicon-time action-historical";
				break;
			}
			icon = "<span class='glyphicon " + cssClass + "'></span>";
		}

		return icon;
	}
};

Helpers.tenant = {
		statusIcon : function(status) {
			var icon = "";
			if (status) {
				var cssClass = "";
				switch (status) {
					case "draft":
						cssClass = "glyphicon-pencil action-draft";
						break;
					case "req_inst":
						cssClass = "glyphicon-cog action-request-installation";
						break;
					case "inst":
						cssClass = "glyphicon-save action-install";
						break;
					case "req_uninst":
						cssClass = "glyphicon-cog action-uninstall";
						break;
					case "uninst":
						cssClass = "glyphicon-time action-historical";
						break;
					case "reject":
						cssClass = "glyphicon-remove-circle action-rejected";
						break;
					case "prg_inst":
						cssClass = "glyphicon-flash action-progress";
						break;
					case "prg_uninst":
						cssClass = "glyphicon-flash action-progress";
						break;
					case "inst_fail":
						cssClass = "glyphicon-remove action-rejected";
						break;
					
				}
				icon = "<span class='glyphicon " + cssClass + "'></span>";
			}

			return icon;
		},
//		statusIconAdmin : function(stream) {
//			var icon = "";
//			if (stream.tenantStatus.description) {
//				var cssClass = "";
//				switch (stream.tenantStatus.tenantstatuscode) {
//				case "draft":
//					cssClass = "glyphicon-pencil action-edit";
//					break;
//				case "req_inst":
//					cssClass = "glyphicon-cog action-request-installation";
//					break;
//				case "inst":
//					cssClass = "glyphicon-save action-install";
//					break;
//				case "req_uninst":
//					cssClass = "glyphicon-cog action-uninstall";
//					break;
//				case "uninst":
//					cssClass = "glyphicon-time action-historical";
//					break;
//				}
//				icon = "<span class='glyphicon " + cssClass + "'></span>";
//			}
//
//			return icon;
//		}
	};


Helpers.util = {
	isStringEmpty : function(str) {
		return (!str || 0 === str.length);
	},
	
	isNumber: function (n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
	},
	
	initArrayZeroOneElements : function(obj) {
		var result = [];
		if (obj) {
			if (obj instanceof Array) {
				result = obj;
			} else {
				result.push(obj);
			}
		}
		return result;
	},

	cleanNilInField : function(obj) {
		if (obj) {
			for ( var property in obj) {
				if (obj.hasOwnProperty(property)) {
					if (typeof (obj[property]) === 'object' && obj[property] != null && obj[property]["@nil"]) {
						obj[property] = null;
					}
				}
			}

		}
	},

	scrollTo : function(elementId) {
		var top = 0;
		if (elementId)
			top = $('#' + elementId).offset().top;

		$('html,body').animate({
			scrollTop : top
		}, 500);

	},

	arrayMoveUpElement : function(array, elementIndex) {
		var result = [];
		if (array && array instanceof Array) {
			if (elementIndex >= array.length - 1)
				result = array;
			else {
				for (var i = 0; i < array.length; i++) {
					if (i == elementIndex)
						result.push(array[i + 1]);
					else if (i == elementIndex + 1)
						result.push(array[i - 1]);
					else
						result.push(array[i]);

				}
			}
		}
		return result;
	},

	arrayMoveDownElement : function(array, elementIndex) {
		var result = [];
		if (array && array instanceof Array) {
			if (elementIndex <= 0)
				result = array;
			else {
				for (var i = 0; i < array.length; i++) {
					if (i == elementIndex - 1)
						result.push(array[i + 1]);
					else if (i == elementIndex)
						result.push(array[i - 1]);
					else
						result.push(array[i]);

				}
			}
		}
		return result;
	},

	capitaliseFirstLetter:function (input)
	{
		if(input && input!=null)
			return string.charAt(0).toUpperCase() + string.slice(1);
		return "";
	}, 
	
	CSVtoArray : function(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
		// Delimiters.
		"(\\" + strDelimiter + "|\\r\\n|\\r|^)" +			
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		// Standard fields.
		"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [ [] ];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[1];
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
			} else {
				// We found a non-quoted value.
				strMatchedValue = arrMatches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}
		// Return the parsed data.
		return (arrData);
	},
	
	getEnvirorment: function(host){
		var env = host.substring(0,host.indexOf("sdnet-intapi.sdp.csi.it"));
		return env;
	},
	copyPropSafe : function(prop, objIn, objOut){
		if(typeof objIn != 'undefined' && 
			typeof objOut != 'undefined' && 
			typeof prop != 'undefined' &&
			typeof objIn[prop] != 'undefined' )
			objOut[prop] = objIn[prop];
	},
	
	copyObjPropSafe : function(prop, objIn, objOut){
		if(typeof objIn != 'undefined' && 
			typeof objOut != 'undefined' && 
			typeof prop != 'undefined' &&
			typeof objIn[prop] != 'undefined' &&
			objIn[prop] != null){

			objOut[prop] = {};
			for (var innerProp in objIn[prop]) {
			    if (objIn[prop].hasOwnProperty(innerProp)) {
			    	objOut[prop][innerProp] = objIn[prop][innerProp];
			    }
			}				
		}
	},
	has : function(obj, key) {
	    return key.split(".").every(function(x) {
	        if(typeof obj != "object" || obj === null || !(x in obj))
	            return false;
	        obj = obj[x];
	        return true;
	    });
	},
	initArrayZeroOneElements : function(obj) {
		var result = [];
		if (obj) {
			if (obj instanceof Array) {
				result = obj;
			} else {
				result.push(obj);
			}
		}
		return result;
	}
};

Helpers.errors = {
	wsErrorUrl : function(tenantCode) {
		var result = "/topic/output." + tenantCode + ".errors";
		return result;
	}
};

Helpers.render = {
	
	safeTags : function (stringIn) {
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
			else 
				outString = stringIn;
		}
	    return outString;   

	},
	linkify: function(stringIn) {
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string"){
			    var  replacePattern1, replacePattern2, replacePattern3;
		
			    //URLs starting with http://, https://, or ftp://
			    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			    outString = stringIn.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
		
			    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
			    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			    outString = outString.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
		
			    //Change email addresses to mailto:: links.
			    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
			    outString = outString.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
			} else 
				outString = stringIn;
		}

		return outString;
	},
	
	removeImage: function(stringIn){
		var stringOut = "";
		if(stringIn && stringIn!=null){
		    var imageStart = stringIn.indexOf("data:image");
		    console.log("imageStart", imageStart);
		    var stringOut = stringIn;
		    if(imageStart>0){
		        var imageEnd = stringIn.indexOf("\"", imageStart);
		        stringOut = stringIn.substring(0,imageStart) + "<span class='logRemoveString'>Removed&hellip;</span>" + stringIn.substring(imageEnd);
		        console.log("imageStart", imageEnd);
	
		    }
		}
	    return stringOut;   
	},

	colorize: function(stringIn){
		var colorizedText = "";
		if(stringIn && stringIn!=null){
		    colorizedText = stringIn.replace( /"idTenant"[ :]+"?([\w+ ]+)"?/,'<span class="log_idTenant">"idTenant"</span>:<span class="log_idTenant logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"codiceTenant"[ :]+"?([\w+ ]+)"?/,'<span class="log_codiceTenant">"codiceTenant"</span>:<span class="log_codiceTenant logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"idVirtualEntity"[ :]+"?([\w+ ]+)"?/,'<span class="log_idVirtualEntity">"idVirtualEntity"</span>:<span class="log_idVirtualEntity logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"codiceVirtualEntity"[ :]+"?([\w+ +:+;+-]+)"?/,'<span class="log_codiceVirtualEntity">"codiceVirtualEntity"</span>:<span class="log_codiceVirtualEntity logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"idStream"[ :]+"?([\w+ ]+)"?/,'<span class="log_idStream">"idStream"</span>:<span class="log_idStream logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"codiceStream"[ :]+"?([\w+ +:+;+-]+)"?/,'<span class="log_codiceStream">"codiceStream"</span>:<span class="log_codiceStream logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"esitoFabricController"[ :]+"?([\w+ +:+;]+)"?/,'<span class="log_esitoFabricController">"esitoFabricController"</span>:<span class="log_esitoFabricController logValue">$1</span>');
		    colorizedText = colorizedText.replace( /"deploymentStatusDesc"[ :]+"?([\w+ ]+)"?/,'<span class="log_deploymentStatusDesc">"deploymentStatusDesc"</span>:<span class="log_deploymentStatusDesc logValue">$1</span>');
		}
	    return colorizedText;
	}
};

Helpers.yucca = {
		prepareDatasourceForUpdate: function(datasourceType, dsIn){
			var dsOut = {"datasourceType": datasourceType};
			if(typeof dsIn != 'undefined' && dsIn!= null){
				
				
				Helpers.util.copyPropSafe('copyright', dsIn, dsOut);
				Helpers.util.copyPropSafe('disclaimer', dsIn, dsOut);
				Helpers.util.copyPropSafe('externalreference', dsIn, dsOut);
				Helpers.util.copyPropSafe('icon', dsIn, dsOut);
				Helpers.util.copyPropSafe('jdbcdbname', dsIn, dsOut);
				Helpers.util.copyPropSafe('jdbcdbtype', dsIn, dsOut);
				Helpers.util.copyPropSafe('jdbcdburl', dsIn, dsOut);
				Helpers.util.copyPropSafe('jdbctablename', dsIn, dsOut);
				Helpers.util.copyPropSafe('jdbcdbschema', dsIn, dsOut);

				
				Helpers.util.copyPropSafe('multiSubdomain', dsIn, dsOut);
				Helpers.util.copyPropSafe('unpublished', dsIn, dsOut);
				Helpers.util.copyPropSafe('visibility', dsIn, dsOut);
				Helpers.util.copyPropSafe('registrationDate', dsIn, dsOut);

				//Helpers.util.copyPropSafe('dbhiveschema', dsIn, dsOut);
				//Helpers.util.copyPropSafe('dbhivetable', dsIn, dsOut);
				
				Helpers.util.copyObjPropSafe('dcat', dsIn, dsOut);
				Helpers.util.copyObjPropSafe('opendata', dsIn, dsOut);
				Helpers.util.copyObjPropSafe('license', dsIn, dsOut);
				
				
				


				dsOut.currentDataSourceVersion = dsIn.version;
				//dsOut.idDataSource= dsIn.;
				//dsOut.importfiletype= dsIn.;
				//dsOut.privacyacceptance": true,
				//dsOut.requestermail": "string",
				//dsOut.requestername": "string",
				//dsOut.requestersurname": "string",
				
				
				
	  			if(typeof dsIn.stream != 'undefined'){
					dsOut.idstream = dsIn.stream.idstream;
					dsOut.streamcode = dsIn.stream.streamcode;
					dsOut.streamname = dsIn.stream.streamname;
					dsOut.fps = dsIn.stream.fps;
					dsOut.savedata = dsIn.stream.savedata;

	  				// twitter
	  				if(typeof dsIn.stream.smartobject != 'undefined' && dsIn.stream.smartobject.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
	  					Helpers.util.copyObjPropSafe('twitterInfo', dsIn.stream, dsOut);
	  				}
	  				
					// siddhi
	  				if(typeof dsIn.stream.smartobject != 'undefined' && dsIn.stream.smartobject.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
	  					dsOut.isInternal = true;
	  					dsOut.internalquery = dsIn.stream.internalquery;
	  					dsOut.internalStreams = new Array();
	  					if(typeof dsIn.stream.internalStreams != 'undefined' && dsIn.stream.internalStreams!=null){
	  						for (var internalStreamIndex = 0; internalStreamIndex < dsIn.stream.internalStreams.length; internalStreamIndex++) {
	  							dsOut.internalStreams.push({"idstream": dsIn.stream.internalStreams[internalStreamIndex].idstream, "streamalias": dsIn.stream.internalStreams[internalStreamIndex].streamalias});
							}
	  					}
	  				}else
	  					dsOut.isInternal = false;

					//$scope.streamSiddhiMirror= $scope.stream.stream.internalQuery;	
	  			}

				
				
				if(typeof dsIn.dataset != 'undefined' && dsIn.dataset!= null){
					dsOut.iddataset = dsIn.dataset.iddataset;
					dsOut.datasetcode = dsIn.dataset.datasetcode;
					dsOut.datasetname =  dsIn.dataset.datasetname;
					dsOut.description= dsIn.dataset.description;
					
					dsOut.description= dsIn.dataset.description;
					
					dsOut.jdbcdbname= dsIn.dataset.jdbcdbname;
					dsOut.jdbcdbschema= dsIn.dataset.jdbcdbschema;
					dsOut.jdbcdbtype= dsIn.dataset.jdbcdbtype;
					dsOut.jdbcdburl= dsIn.dataset.jdbcdburl;
					dsOut.jdbctablename= dsIn.dataset.jdbctablename;
					
					dsOut.dbhiveschema= dsIn.dataset.dbhiveschema;
					dsOut.dbhivetable= dsIn.dataset.dbhivetable;
					
					
					if(typeof dsIn.dataset.importedfiles != 'undefined' && dsIn.dataset.importedfiles!= null)
						dsOut.importedfiles = dsIn.dataset.importedfiles.split(",");
					dsOut.jdbcnativetype = dsIn.jdbcnativetype
					//dsOut.hivetype = dsIn.hivetype
					//if(typeof dsIn.dataset.importedfiles != 'undefined' && dsIn.dataset.importedfiles!= null){
						//dsOut.importedfiles = dsIn.dataset.importedfiles.split(",");
					//}


				}
				
				if(typeof dsIn.subdomain != 'undefined' && dsIn.subdomain!= null){
					dsOut.idSubdomain= dsIn.subdomain.idSubdomain;
				}

				if(typeof dsIn.domain != 'undefined' && dsIn.domain!= null){
					dsOut.domaincode= dsIn.domain.domaincode;
				}

				if(typeof dsIn.tenantManager != 'undefined' && dsIn.tenantManager!= null){
					dsOut.idTenant= dsIn.tenantManager.idTenant;
				}
				
				if(typeof dsIn.tags != 'undefined' && dsIn.tags!= null){
					dsOut.tags= new Array();
					for (var tagIndex = 0; tagIndex < dsIn.tags.length; tagIndex++) {
						dsOut.tags.push(dsIn.tags[tagIndex].idTag);
					}
				}

				if(typeof dsIn.groups != 'undefined' && dsIn.groups!= null){
					dsOut.groups = new Array(); // remove datasetgroup frozen
					for (var i = 0; i < dsIn.groups.length; i++) {
						if(dsIn.groups[i].status == 'DRAFT')
							dsOut.groups.push(dsIn.groups[i]);
					}
				}

				if(typeof dsIn.sharingTenants != 'undefined' && dsIn.sharingTenants!= null){
					dsOut.sharingTenants= new Array();
					for (var stIndex = 0; stIndex < dsIn.sharingTenants.length; stIndex++) {
						dsOut.sharingTenants.push(dsIn.sharingTenants[stIndex]);
					}
				}

				
				if(typeof dsIn.components != 'undefined' && dsIn.components!= null){
					dsOut.components= new Array();
					for (var componentIndex = 0; componentIndex < dsIn.components.length; componentIndex++) {
						var cIn = dsIn.components[componentIndex];
						var cOut = {};
						Helpers.util.copyPropSafe('alias', cIn, cOut);
						Helpers.util.copyPropSafe('datetimeformat', cIn, cOut);
						Helpers.util.copyPropSafe('foreignkey', cIn, cOut);
						Helpers.util.copyPropSafe('idComponent', cIn, cOut);
						Helpers.util.copyPropSafe('inorder', cIn, cOut);
						Helpers.util.copyPropSafe('iskey', cIn, cOut);
						Helpers.util.copyPropSafe('name', cIn, cOut);
						Helpers.util.copyPropSafe('required', cIn, cOut);
						Helpers.util.copyPropSafe('sourcecolumn', cIn, cOut);
						Helpers.util.copyPropSafe('sourcecolumnname', cIn, cOut);
						Helpers.util.copyPropSafe('tolerance', cIn, cOut);
						Helpers.util.copyPropSafe('sinceVersion', cIn, cOut);
						Helpers.util.copyPropSafe('isgroupable', cIn, cOut);
						
						Helpers.util.copyPropSafe('jdbcnativetype', cIn, cOut);
						Helpers.util.copyPropSafe('hivetype', cIn, cOut);
						
						Helpers.util.copyObjPropSafe('measureUnit', cIn, cOut);
						Helpers.util.copyObjPropSafe('phenomenon', cIn, cOut);
						Helpers.util.copyObjPropSafe('dataType', cIn, cOut);

						
						if(typeof cIn.dataType != 'undefined' && cIn.dataType!= null)
							cOut.idDataType = cIn.dataType.idDataType;

						if(typeof cIn.measureUnit != 'undefined' && cIn.measureUnit!= null)
							cOut.idMeasureUnit = cIn.measureUnit.idMeasureUnit;
						
						if(typeof cIn.phenomenon != 'undefined' && cIn.phenomenon!= null)
							cOut.idPhenomenon = cIn.phenomenon.idPhenomenon;
						
						dsOut.components.push(cOut);
					}
				}
			}
			return dsOut;
		}
};

