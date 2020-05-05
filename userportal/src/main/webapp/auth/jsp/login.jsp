<!--
SPDX-License-Identifier: EUPL-1.2
(C) Copyright 2019 Regione Piemonte
-->

<!DOCTYPE html>
<!--
~ Copyright (c) 2005-2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
~
~ WSO2 Inc. licenses this file to you under the Apache License,
~ Version 2.0 (the "License"); you may not use this file except
~ in compliance with the License.
~ You may obtain a copy of the License at
~
~    http://www.apache.org/licenses/LICENSE-2.0
~
~ Unless required by applicable law or agreed to in writing,
~ software distributed under the License is distributed on an
~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
~ KIND, either express or implied.  See the License for the
~ specific language governing permissions and limitations
~ under the License.
-->
<%@page import="java.util.Arrays"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="java.net.URLDecoder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.CharacterEncoder"%>
<%@ page import="org.wso2.carbon.identity.application.common.util.IdentityApplicationConstants"%>

<fmt:bundle basename="org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources">

<html lang="en">

<head>
<meta charset="utf-8">
<title>Login Yucca</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->
<!--<link href="https://fonts.googleapis.com/css?family=Titillium+Web:400,700" rel="stylesheet">-->
<link href="css/font/fontTitilliumWeb/css/titilliumWeb.css" rel="stylesheet"> 

<link href="assets/css/bootstrap.min.css" rel="stylesheet">
<link href="css/localstyles.css" rel="stylesheet">
<%  String customCssPath = request.getParameter("customCssPath");
		if(customCssPath!=null){
	%>
<link href="<%=URLDecoder.decode(customCssPath)%>" rel="stylesheet">
<%
		}
	%>

<% String currentLang = request.getParameter("currentLang");
   if(currentLang != null){
%>
<script> var currentLang="<%=currentLang%>";</script>
<% } %>
<link rel="shortcut icon" href="https://userportal.smartdatanet.it/userportal/favicon.png" >
<!--[if lt IE 8]>
<link href="css/localstyles-ie7.css" rel="stylesheet">
<![endif]-->

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
<script src="assets/js/html5.js"></script>
<![endif]-->
<script src="assets/js/jquery-1.7.1.min.js"></script>
<script src="js/scripts.js"></script>

<script src="js/yucca.js"></script> 
<!-- <script src="https://int-userportal.smartdatanet.it/ris/auth/js/yucca.js"></script>  -->
<style>
    div.different-login-container a.truncate {
  width: 148px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>



<!--  parameters

<%@ page import = "java.util.Map" %>
<%
	Map<String, String[]> parameters = request.getParameterMap();
	for(String parameter : parameters.keySet()) {
	  String[] values = parameters.get(parameter);
	  if(values==null)
	     out.println("param: "+parameter+" - value: NULL");
	  else{
	     out.println("param: "+parameter+" - values size: " + values.length);
	     out.println("Encoded: "+CharacterEncoder.getSafeText(request.getParameter(parameter)));
	     for(String value : values){
	       out.println(" - value: "+value);
	     }
	  }
	}

%>
-->
</head>

<body>
<div class="overlay" style="display:none"></div>
<div class="header-strip">&nbsp;</div>
<div class="header-back">
    <div class="container">
	<div class="row">
	    <div class="span8">
		<a class="logo">&nbsp</a>
	    </div>
	    <div class="span4">
		<div class="imgLogodev"></div>
		<div class="logodev">developer center</div>
	    </div>
	</div>
    </div>
</div>

<div class="header-text">

</div>
<!-- container -->
<%@ page import="java.util.Map" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.CharacterEncoder" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.Constants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.TenantDataManager" %>

<%

		request.getSession().invalidate();
		String queryString = request.getQueryString();
		Map<String, String> idpAuthenticatorMapping = null;
		if (request.getAttribute("idpAuthenticatorMap") != null) {
			idpAuthenticatorMapping = (Map<String, String>)request.getAttribute("idpAuthenticatorMap");
		}

		String errorMessage = "Errore durante l'autenticazione. Si prega di riprovare";
		String loginFailed = "false";

		if (CharacterEncoder.getSafeText(request.getParameter(Constants.AUTH_FAILURE)) != null &&
				"true".equals(CharacterEncoder.getSafeText(request.getParameter(Constants
				.AUTH_FAILURE)))) {
			loginFailed = "true";

			if(CharacterEncoder.getSafeText(request.getParameter(Constants.AUTH_FAILURE_MSG)) !=
			null){
				errorMessage = (String) CharacterEncoder.getSafeText(request.getParameter
				(Constants.AUTH_FAILURE_MSG));

				if (errorMessage.equalsIgnoreCase("login.fail.message")) {
					errorMessage = "Errore durante l'autenticazione. Si prega di riprovare";
				}
			}
		}
	%>

<script type="text/javascript">
    function doLogin() {
	var loginForm = document.getElementById('loginForm');
	loginForm.submit();
    }
</script>

<%

		boolean hasLocalLoginOptions = false;
		List<String> localAuthenticatorNames = new ArrayList<String>();

		if (idpAuthenticatorMapping.get(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME) != null){
				String authList = idpAuthenticatorMapping.get(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME);
				if (authList!=null){
						localAuthenticatorNames = Arrays.asList(authList.split(","));
				}
		}


	%>


<%
		if ((hasLocalLoginOptions && localAuthenticatorNames.size() > 1) || (!hasLocalLoginOptions)
		|| (hasLocalLoginOptions && idpAuthenticatorMapping.size() > 1)) {
%>
<div class="container" id='different-login-title'>
    <div class="row">
	<div class="span12">
	    <% if(hasLocalLoginOptions) { %>
	    <h2>Other login options:</h2>
	    <%} else { %>
	    <script type="text/javascript">
		document.getElementById('local_auth_div').style.display = 'block';
	    </script>
	    <%} %>
	</div>
    </div>
</div>

	
<div class="container different-login-container ">
    <div class="brand-site-back">
     <!--  <a href="https://userportal.smartdatanet.it/userportal/#/home">  -->
       <a href="https://tst-yucca-smartdatanet.portali.csi.it/">
	 <i class="fas fa-arrow-left"></i><span class='arrow-left'>&#10140;</span> 
	 <span id='back-to-home-btn'>Torna alla home page</span>
       </a>
    </div>
    <div class="brand-site"><a href="https://userportal.smartdatanet.it/userportal/#/home"><span class="sr-only">Yucca</span></a></div>
    <h1 id='title-auth'>Accedi con le tue credenziali</h1>
    <h1 id='title-social'>Prova Yucca</h1>

		<div id='social_panel'>
			<div id='social_intro'></div>
			<% for (Map.Entry<String, String> idpEntry : idpAuthenticatorMapping.entrySet())  { 
						if(idpEntry.getKey().contains("Social") ){
							%>
					<div class="authItems">
					<div class="authItem <%=idpEntry.getKey().replaceAll(" ","") %>">
						<% if(!idpEntry.getKey().equals(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME)) {
									String idpName = idpEntry.getKey();
									boolean isHubIdp = false;
									if (idpName.endsWith(".hub")){
										isHubIdp = true;
										idpName = idpName.substring(0, idpName.length()-4);
									}
									if (isHubIdp) { %>
						<a href="#" class="main-link">
							<%=idpName%></a>
						<div class="slidePopper" style="display:none">
							<input type="text" id="domainName" name="domainName" />
							<input type="button" class="btn btn-primary go-btn" onClick="javascript: myFunction('<%=idpName%>','<%=idpEntry.getValue()%>','domainName')" value="Go" />
						</div>
						<%}else{ %>
						<a onclick="javascript: handleNoDomain('<%=idpName%>','<%=idpEntry.getValue()%>')" class="main-link truncate btn-link" style="cursor:pointer" title="<%=idpName%>">&nbsp;</a>
						<%} %>
						<%}else if(localAuthenticatorNames.size()>0 && localAuthenticatorNames.contains("IWAAuthenticator")) {%>
						<div class='span12'>
							<h2>
								<%=idpEntry.getKey()%>
							</h2>
						</div>
						<div class="span12">
							<a onclick="javascript: handleNoDomain('<%=idpEntry.getKey()%>','IWAAuthenticator')" class="main-link" style="cursor:pointer">IWA</a>
						</div>
						<%}%>
					</div>
					</div>
				<%}%>
			<%}%>
		</div>

    <div class="container" id="auth_panel">

	<ul class="menu_login">
	    <li id='tab-1-link' class="menu_login_link current" data-tab="tab-1" show_panels="norupar nosmartdata"><span class='menu_login_label'>Cittadino</span></li>
                    <li id='tab-2-link' class="menu_login_link" data-tab="tab-1" show_panels="norupar"><span class='menu_login_label'>Azienda</span></li>
                    <li id='tab-3-link' class="menu_login_link" data-tab="tab-1" show_panels=""><span class='menu_login_label'>PA</span></li>
                </ul>
                <div id="tab-1" class="tab-panel current ">
                     <div id='tab-1-content' class="norupar nosmartdata">
                                        <p class="login_intro">
                                            <span></span>
                                        </p>
			                <% if ("true".equals(loginFailed)) { %>
                        		    <div  class="auth-error alert alert-error"><%=errorMessage%></div>
                    			<% } %>
					<div class='authItems'>
						<% for (Map.Entry<String, String> idpEntry : idpAuthenticatorMapping.entrySet())  { 
							if(idpEntry.getKey().contains("SistemaPiemonte") || idpEntry.getKey().contains("RuparPiemonte") || idpEntry.getKey().contains("Spid")){
								%>
						<div class="authItem <%=idpEntry.getKey().replaceAll(" ","") %>">
							<% if(!idpEntry.getKey().equals(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME)) {
										String idpName = idpEntry.getKey();
										boolean isHubIdp = false;
										if (idpName.endsWith(".hub")){
											isHubIdp = true;
											idpName = idpName.substring(0, idpName.length()-4);
										}
										if (isHubIdp) { %>
							<a href="#" class="main-link">
								<%=idpName%></a>
							<div class="slidePopper" style="display:none">
								<input type="text" id="domainName" name="domainName" />
								<input type="button" class="btn btn-primary go-btn" onClick="javascript: myFunction('<%=idpName%>','<%=idpEntry.getValue()%>','domainName')" value="Go" />
							</div>
							<%}else{ %>
							<a onclick="javascript: handleNoDomain('<%=idpName%>','<%=idpEntry.getValue()%>')" class="main-link btn-link truncate" style="cursor:pointer" title="<%=idpName%>">&nbsp;</a>
                                                        <p class='info hint-panel'><a href="" target="_blank"></a></p>
							<%} %>
							<%}else if(localAuthenticatorNames.size()>0 && localAuthenticatorNames.contains("IWAAuthenticator")) {%>
							<div class='span12'>
								<h2>
									<%=idpEntry.getKey()%>
								</h2>
							</div>
							<div class="span12">
								<a onclick="javascript: handleNoDomain('<%=idpEntry.getKey()%>','IWAAuthenticator')" class="main-link" style="cursor:pointer">IWA</a>
                                                        </div>
							<%}%>
						</div>
						<%}%>
						<%}%>
					</div> 

                    <!-- login password -->
                    <%if(localAuthenticatorNames.contains("BasicAuthenticator") || localAuthenticatorNames.contains("CsidelegateLocalAuthenticator")){ %>
						<div id='local_auth_title' class="authItem userpassword">
							<a href id='local_auth_accordion' class="btn-link"  >
								Entra con Smartdatanet
                                                              <i class="accordion_icon icon-chevron-down"></i>
							</a>
							<div id="local_auth_div" class="container main-login-container hide" >
                    <%} %>

                        <form action="../commonauth" method="post" id="loginForm" class="form-horizontal">

                                <%
						if(localAuthenticatorNames.size()>0) {
							if(localAuthenticatorNames.size()>0 && localAuthenticatorNames.contains("OpenIDAuthenticator")){
								hasLocalLoginOptions = true;
					%>

                             -   <div class="row">
                                    <div class="span6">

                                        <%@ include file="openid.jsp" %>

                                    </div>
                                </div>

                                <%
					} else if(localAuthenticatorNames.size()>0 && (localAuthenticatorNames.contains("BasicAuthenticator") || 
							localAuthenticatorNames.contains("CsidelegateLocalAuthenticator"))) {
						hasLocalLoginOptions = true;
					%>

                                <%
						if(TenantDataManager.isTenantListEnabled() && "true".equals(CharacterEncoder.getSafeText(request.getParameter("isSaaSApp")))){
					%>
                                <div class="row">
                                    <div class="span6">

                                        <%@ include file="tenantauth.jsp" %>

                                    </div>
                                </div>

                                <script>
                                    //set the selected tenant domain in dropdown from the cookie value
							window.onload=selectTenantFromCookie;
						</script>

                                <%
						} else{
					%>
                                <div class="row">
                                    <div class="span12">
                                        <%@ include file="basicauth.jsp" %>
                                        <div class="">
                                            <p>&nbsp;</p>
                                            <p><strong>Password dimenticata?</strong><br>
                                                Se non ricordi la password o vuoi cambiarla segui la procedura di <a href="https://sso.smartdatanet.it/UserRecovery/infoRecover/userInfoView">Reset password</a>
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                <%
						}
					}
            }
            %>
                                <%if(idpAuthenticatorMapping.get(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME) != null){ %>
                        </div>
                        <%} %>

                        </form>
                    </div>




                  </div>
                </div>
                <div id="tab-3" class="tab-content hide"> 
                    <% if ("true".equals(loginFailed)) { %>
                            <div class="auth-error alert alert-error"><%=errorMessage%></div>
                    <% } %>
 
                    <% for (Map.Entry<String, String> idpEntry : idpAuthenticatorMapping.entrySet())  { 
						if(idpEntry.getKey().contains("RuparPiemonte") ){
							%>
		 <div class='authItems'>
                    <div class="authItem <%=idpEntry.getKey().replaceAll(" ","") %>">
                        <% if(!idpEntry.getKey().equals(IdentityApplicationConstants.RESIDENT_IDP_RESERVED_NAME)) {
									String idpName = idpEntry.getKey();
									boolean isHubIdp = false;
									if (idpName.endsWith(".hub")){
										isHubIdp = true;
										idpName = idpName.substring(0, idpName.length()-4);
									}
									if (isHubIdp) { %>
                        <a href="#" class="main-link">
                            <%=idpName%></a>
                        <div class="slidePopper" style="display:none">
                            <input type="text" id="domainName" name="domainName" />
                            <input type="button" class="btn btn-primary go-btn" onClick="javascript: myFunction('<%=idpName%>','<%=idpEntry.getValue()%>','domainName')" value="Go" />
                        </div>
                        <%}else{ %>
                        <a onclick="javascript: handleNoDomain('<%=idpName%>','<%=idpEntry.getValue()%>')" class="main-link truncate btn-link" style="cursor:pointer" title="<%=idpName%>">&nbsp;</a>
                        <%} %>
                        <%}else if(localAuthenticatorNames.size()>0 && localAuthenticatorNames.contains("IWAAuthenticator")) {%>
                        <div class='span12'>
                            <h2>
                                <%=idpEntry.getKey()%>
                            </h2>
                        </div>
                        <div class="span12">
                            <a onclick="javascript: handleNoDomain('<%=idpEntry.getKey()%>','IWAAuthenticator')" class="main-link" style="cursor:pointer">IWA</a>
                        </div>
                        <%}%>
                    </div>
	         </div>
                    <%}%>
                    <%}%>
                </div>
            </div>
		</div>
		<%}%>

            <script>
                $(document).ready(function() {
                    $('.main-link').click(function() {
                        $('.main-link').next().hide();
                        $(this).next().toggle('fast');
                        var w = $(document).width();
                        var h = $(document).height();
                        $('.overlay').css("width", w + "px").css("height", h + "px").show();
                    });
                    $('.overlay').click(function() {
                        $(this).hide();
                        $('.main-link').next().hide();
                    });

                });

                function myFunction(key, value, name) {
                    var object = document.getElementById(name);
                    var domain = object.value;


                    if (domain != "") {
                        document.location = "../commonauth?idp=" + key + "&authenticator=" + value + "&sessionDataKey=<%=CharacterEncoder.getSafeText(request.getParameter("sessionDataKey"))%>&domain=" + domain;
                    } else {
                        document.location = "../commonauth?idp=" + key + "&authenticator=" + value + "&sessionDataKey=<%=CharacterEncoder.getSafeText(request.getParameter("sessionDataKey"))%>";
                    }
                }

                function handleNoDomain(key, value) {


                    document.location = "../commonauth?idp=" + key + "&authenticator=" + value + "&sessionDataKey=<%=CharacterEncoder.getSafeText(request.getParameter("sessionDataKey"))%>";

                }
            </script>

    </body>

    </html>

</fmt:bundle>
