/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

var Helpers = Helpers || {};

Helpers.stream = {
	wsOutputUrlFromMetadata : function(metadata) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var virtualentity_stream = "";

		if (!Helpers.util.isStringEmpty(metadata.stream.smartobject.code) && !Helpers.util.isStringEmpty(metadata.stream.code))
			virtualentity_stream = metadata.stream.smartobject.code + "_" + metadata.stream.code;
		else if (!Helpers.util.isStringEmpty(metadata.stream.smartobject.code))
			virtualentity_stream = metadata.stream.smartobject.code;
		else if (!Helpers.util.isStringEmpty(metadata.stream.code))
			virtualentity_stream += metadata.stream.code;

		var result = "/topic/output." + metadata.tenantCode + "." + virtualentity_stream;
		return result;
	},		
		
	wsOutputUrl : function(stream) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var virtualentity_stream = "";

		/*if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity) && !Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream = stream.codiceVirtualEntity + "_" + stream.codiceStream;
		else if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity))
			virtualentity_stream = stream.codiceVirtualEntity;
		else if (!Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream += stream.codiceStream;

		var result = "/topic/output." + stream.codiceTenant + "." + virtualentity_stream;*/
		if (!Helpers.util.isStringEmpty(stream.stream.smartobject.socode) && !Helpers.util.isStringEmpty(stream.stream.streamcode))
			virtualentity_stream = stream.stream.smartobject.socode + "_" + stream.stream.streamcode;
		else if (!Helpers.util.isStringEmpty(stream.stream.smartobject.socode ))
			virtualentity_stream = stream.stream.smartobject.socode ;
		else if (!Helpers.util.isStringEmpty(stream.stream.streamcode))
			virtualentity_stream += stream.stream.streamcode;

		var result = "/topic/output." + stream.tenantManager.tenantcode + "." + virtualentity_stream;
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
		if (stream.deploymentStatusDesc) {
			var cssClass = "";
			switch (stream.deploymentStatusCode) {
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

Helpers.yucca = {
	prepareDatasourceForUpdate: function(datasourceType, dsIn){
		var dsOut = {"datasourceType": datasourceType};
		if(typeof dsIn != 'undefined' && dsIn!= null){
			
			Helpers.util.copyPropSafe('apiContexts', dsIn, dsOut);
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

			Helpers.util.copyPropSafe('jdbctablename', dsIn, dsOut);
			Helpers.util.copyPropSafe('jdbctablename', dsIn, dsOut);
			
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
				
				if(typeof dsIn.dataset.importedfiles != 'undefined' && dsIn.dataset.importedfiles!= null)
					dsOut.importedfiles = dsIn.dataset.importedfiles.split(",");
				dsOut.jdbcnativetype = dsIn.jdbcnativetype
				dsOut.hivetype = dsIn.hivetype
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
	},
	checkTag: function(datasource){
		var rslt = true;
		if (typeof datasource !='undefined' && datasource!=null && datasource.tags && datasource.tags.length > 0){
			rslt = false;
		};
		
		return rslt;
	},
	checkDCat: function(datasource){
		var rslt = true;
		if(typeof datasource !='undefined' && datasource!=null){
			if(datasource.unpublished === true ||
				(Helpers.util.has(datasource, "dcat.dcatrightsholdername") && datasource.dcat.dcatrightsholdername != null && datasource.dcat.dcatrightsholdername != "" && 
				Helpers.util.has(datasource, "dcat.dcatemailorg")  && datasource.dcat.dcatemailorg != null && datasource.dcat.dcatemailorg != "" &&
				Helpers.util.has(datasource, "dcat.dcatemailorg") && datasource.dcat.dcatrightsholdername != null && datasource.dcat.dcatemailorg != ""))
			rslt = false;
		};
		
		return rslt;
	},
	checkDatasource: function(datasource){
		return Helpers.yucca.checkTag(datasource) || Helpers.yucca.checkDCat(datasource) || !Helpers.util.has(datasource, "domaincode") || !Helpers.util.has(datasource, "idSubdomain");
	},
	deleteDcatId: function(originalDcat, newDcat){  // if dcat changed must clean the id to create e new version of dcat
		if((typeof originalDcat == 'undefined' || originalDcat ==null) && (typeof newDcat == 'undefined' || newDcat ==null)) // every thing is null, don't need any update
			return false;
		else if(typeof originalDcat == 'undefined' || originalDcat ==null)  //the original is null, don't need update
			return false
		else if(typeof newDcat == 'undefined' || newDcat ==null)  // the new is null , don't need update
			return false;
		else{
			if(originalDcat.dcatrightsholdername != newDcat.dcatrightsholdername || 
				originalDcat.dcatrightsholdertype != newDcat.dcatrightsholdertype || 
				originalDcat.dcatrightsholderid != newDcat.dcatrightsholderid || 
				originalDcat.dcatcreatorname != newDcat.dcatcreatorname || 
				originalDcat.dcatcreatortype != newDcat.dcatcreatortype || 
				originalDcat.dcatcreatorid != newDcat.dcatcreatorid || 
				originalDcat.dcatnomeorg != newDcat.dcatnomeorg || 
				originalDcat.dcatemailorg != newDcat.dcatemailorg )	
			return true;
		}
		return false;
	}
};

Helpers.util = {
	isStringEmpty : function(str) {
		return (!str || 0 === str.length);
	},
	isValidEmail: function(email){
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
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
	
	formatDateForInputHtml5: function(dateIn){
		var dateOut = "";
		try{
			var day = dateIn.getDate();
			var month = 1+ dateIn.getMonth();
			
			dateOut = ""+dateIn.getFullYear()+"-"+(month<10?"0":"")+month+"-"+(day<10?"0":"")+day;
		}
		catch (e) {
			console.error("Helpers.util.formatDateForInputHtml5 - dateIn, error",dateOut, e);
		}

		return dateOut;
		
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

	capitaliseFirstLetter:function (input){
		if(input && input!=null)
			return string.charAt(0).toUpperCase() + string.slice(1);
		return "";
	}, 
	camelize: function (str) {
		if(str && str!=null)
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		else
			return "";
	},
	
	stringEllipse: function(text, length, end) {
    	
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
	}, 
	
	arrayContainsString:function (element, array) {
	    if(typeof array != 'undefined' && array!=null)
	    	return (array.indexOf(element) > -1);
	    else
	    	return false;
	},
	
	endsWith:function(str, suffix){
		if(!str || str==null)
			str = "";
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}, 
	
	CSVtoArray : function(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
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
	
	downloadCSV : function(csv, filename) {
	    var csvFile;
	    var downloadLink;

	    // CSV file
	    csvFile = new Blob([csv], {type: "text/csv"});

	    // Download link
	    downloadLink = document.createElement("a");

	    // File name
	    downloadLink.download = filename;

	    // Create a link to the file
	    downloadLink.href = window.URL.createObjectURL(csvFile);

	    // Hide download link
	    downloadLink.style.display = "none";

	    // Add the link to DOM
	    document.body.appendChild(downloadLink);

	    // Click download link
	    downloadLink.click();
		document.body.removeChild(downloadLink);
	},
	
	downloadMultiCSV:  function(csvFiles) {
		  var link = document.createElement('a');
		  link.style.display = 'none';
		  document.body.appendChild(link);
		  for (var i = 0; i < csvFiles.length; i++) {
			  link.setAttribute('download', csvFiles[i].name);
		    link.setAttribute('href', window.URL.createObjectURL(csvFiles[i]));
		    link.click();
		  }

		  document.body.removeChild(link);
	},
	
//	splitFileCsv : function(file){
//		var splittedCsvFiles = new Array();
//		var chunks = Math.ceil(file.size/Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT,Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT);
//		var chunk = 0;
//		while (chunk <= chunks) {
//		      var offset = chunk*Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT;
//		      console.log('current chunk..', chunk);
//		      console.log('offset...', chunk*Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT);
//		      console.log('file blob from offset...', offset);
//		      splittedCsvFiles.push(file.slice(offset,Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT));
//		      chunk++;
//		}
//		console.log("splittedCsvFiles", splittedCsvFiles);
//
//	},
	splitCsvFile: function(csvLines, numLinesInPart, filename){
		console.log("splitCsvFile",numLinesInPart, filename);
		var csvParts  = new Array();
		var csv = "";
		var linecounter = 0;
		var filecouner = 0;
		var csvFilePart;
		for (var i = 0; i < csvLines.length; i++) {
			if(csvLines[i]!=null && csvLines[i].length>0){
				csv +=  csvLines[i] + "\r\n";
				linecounter++;
				if(linecounter==numLinesInPart){
					//var csvPart = new Blob([csv], {type: "text/csv"});
					var csvFilePart = new File([csv], filename.replace(".csv", "") + "_part"+Helpers.util.lZero(filecouner,3) + ".csv", {type: "text/csv", lastModified: Date.now()});
					csvParts.push(csvFilePart);
					csv = "";
					linecounter = 0;
					filecouner++;
				}
			}
		}
		if(linecounter>0){
			var name = filename;
			if(numLinesInPart<csvLines.length)
				name =  filename.replace(".csv", "") + "_part"+Helpers.util.lZero(filecouner,3) + ".csv";
			var csvFilePart = new File([csv],name, {type: "text/csv", lastModified: Date.now()});
			csvParts.push(csvFilePart);
		}
			
		return csvParts;
	},
	
	
	
	getMediaTypeFromContentType: function(contentType){
	    var mediaType = null;
	    if(typeof contentType !== 'undefined' && contentType!=null && contentType.indexOf('/')>0){
	    	mediaType = contentType.substring(0, contentType.indexOf('/'));
	        
	    }
	    return mediaType;
	},
	
	getQueryParams: function(qs) {
		var params = {};
		if(typeof qs !== 'undefined' && qs!=null){
		    qs = qs.split('+').join(' ');
	
		    var tokens;
		    var re = /[?&]?([^=]+)=([^&]*)/g;
	
		    while (tokens = re.exec(qs)) {
		        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		    }
		}
	    return params;
	},
	isItalianCF : function(input){
		var cf_pattern =/^(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]$/i;
		return  cf_pattern.test(input);
	},
	has : function(obj, key) {
	    return key.split(".").every(function(x) {
	        if(typeof obj != "object" || obj === null || !(x in obj))
	            return false;
	        obj = obj[x];
	        return true;
	    });
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
	lZero: function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}

	
	
};

Helpers.mongo = {
		date2millis : function(dateIn) {
			var time = null;
			if(dateIn){
				var offset = new Date().getTimezoneOffset();
				var parts = /\/Date\((-?\d+)([+-]\d{4})?.*/.exec(dateIn);

				if (parts[2] == undefined)
				    parts[2] = 0;
	                        var p  = parseInt(parts[2]);
				time = new Date(parts[1] - (p * 60000));
			}
			return time;
		},
		date2string : function(dateIn) {
			var formattedDate = "";
			if(dateIn)
				formattedDate = Helpers.mongo.date2millis(dateIn).format("dd/mm/yyyy HH:MM");
			return formattedDate;
		}
};

Helpers.odata = {
		decodeDataType : function(dataTypeOdata) {
			var dataType = "";
			if(dataTypeOdata!=null){
				switch (dataTypeOdata) {
					case "Edm.Boolean":
						dataType = "boolean";
						break;
					case "Edm.DateTime":
					case "Edm.Time":
					case "Edm.DateTimeOffset":
						dataType = "date";
						break;
					case "Edm.Decimal":
					case "Edm.Double":
					case "Edm.Int16":
					case "Edm.Int32":
					case "Edm.Int64":		
						dataType = "number";
						break;
					case "Edm.String":
						dataType = "string";
						break;
					default:
						dataType = "string";
						break;
				}
//				if(dataTypeOdata == "Edm.String")
//					dataType = "string";
			}
		    return dataType;

		    // Not Supported
		    // Edm.SByte
			// Edm.Binary
			// Edm.Byte
			// Edm.Guid
			// Edm.Single
			// Edm.Geography
			// Edm.GeographyPoint
			// Edm.GeographyLineString
			// Edm.GeographyPolygon
			// Edm.GeographyMultiPoint
			// Edm.GeographyMultiLineString
			// Edm.GeographyMultiPolygon
			// Edm.GeographyCollection
			// Edm.Geometry
			// Edm.GeometryPoint
			// Edm.GeometryLineString
			// Edm.GeometryPolygon
			// Edm.GeometryMultiPoint
			// Edm.GeometryMultiLineString
			// Edm.GeometryMultiPolygon
			// Edm.GeometryCollection
			// Edm.Stream
		}
	};


Helpers.errors = {
	wsErrorUrl : function(tenantCode) {
		var result = "/topic/output." + tenantCode + ".errors";
		return result;
	}
};





Helpers.common = {
	createChooseTagTable : function(tagList){
		
		var numColum = 6;
		var chooseTagTable = "<div class='choose-tag-table'><div>";
		var firstLetter = "";
		var columnCounter = 0;
		for (var i = 0; i < tagList.length; i++) {
			if(firstLetter != tagList[i].tagLabel.substring(0,1)){
				firstLetter = tagList[i].tagLabel.substring(0,1);
				chooseTagTable += "</div><div class='choose-tag-table-section'><h4>"+ firstLetter+"</h4></div><div class='row'>";
				columnCounter =0;
			}
			chooseTagTable += "<div class='col-sm-2'><div class='choose-tag-table-item' ng-click='chooseTag("+tagList[i].tagCode+")'>" + tagList[i].tagLabel +  "</div></div>";
			if(columnCounter==numColum)
				chooseTagTable += "</div><div class='row'>";
			columnCounter =0;
		}
		
		
		chooseTagTable += "</div>";
		
		return chooseTagTable;

	},
	getDomainIcon : function(domainKey){
		return typeof Constants.DOMAIN_ICON_MAP[domainKey]!= 'undefined'?Constants.DOMAIN_ICON_MAP[domainKey]:"";
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
		
	prettifyTwitterUser : function(stringIn){
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<span class="tweet-user">$2</span>');
			else 
				outString = stringIn;
		}
		return outString;
	},
	prettifyTwitterHashtag : function(stringIn){
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<span class="tweet-hashtag">$2</span>');
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
	prettifyTwitterMessage: function(stringIn){
		var pretty  = Helpers.render.safeTags(stringIn);
		pretty = 	Helpers.render.linkify(pretty);
		pretty = Helpers.render.prettifyTwitterHashtag(pretty);
		pretty = Helpers.render.prettifyTwitterUser(pretty);
		return pretty;
	}
		
};

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoDateTime2:   "yyyy-mm-dd'+'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
