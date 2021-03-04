/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

$(document).ready(function() {
        if(typeof currentLang == 'undefined' || currentLang==null)
          currentLang='it';
        console.log("yucca local ready! - lang " + currentLang);
   	
        
	function setCookie(key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        }

        function getCookie(key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        }
	

        function selectTab(tab_link_id){
                setCookie('currentTab',tab_link_id);
		var tab_id = $("#"+tab_link_id).attr('data-tab');
                var show_panels = $("#"+tab_link_id).attr('show_panels');
                console.log("tab_i", tab_id,show_panels);

                $('ul.menu_login .menu_login_link').removeClass('current');
                $('.tab-content').removeClass('current');

                $("#"+tab_link_id).addClass('current');
                $("#"+tab_id).addClass('current');
                $("#"+tab_id + "-content").removeClass();
                $("#"+tab_id + "-content").addClass(show_panels);

	}

        var currentTab = getCookie('currentTab');
        if(typeof currentTab != 'undefined' && currentTab!=null)
        	selectTab(currentTab);

	$('ul.menu_login .menu_login_link').click(function(){
		console.log("click")
		var tab_id = $(this).attr("id");
                selectTab(tab_id);
	});
	
	// label in buttons
	if(currentLang=='it'){
          $('.different-login-container .AutenticazioneSistemaPiemonte a.main-link').text('Entra con Sistemapiemonte');
	  $('.different-login-container .AutenticazioneSistemaPiemonte .hint-panel a').attr('href', 'http://www.sistemapiemonte.it/registrazione/index.shtml');
	  $('.different-login-container .AutenticazioneSistemaPiemonte .hint-panel a').text('Non hai le credenziali di Sistemapiemonte?');

	  $('.different-login-container .AutenticazioneSpid a.main-link').text('Entra con SPID');
	  $('.different-login-container .AutenticazioneSpid .hint-panel a').attr('href', 'https://www.spid.gov.it/');
	  $('.different-login-container .AutenticazioneSpid .hint-panel a').text('Non hai SPID?');
	
	  $('.different-login-container .AutenticazioneRuparPiemonte a.main-link').text('Entra con Sistemapiemonte per la PA');

	  $('.AutenticazioneSocial a.btn-link').text('Entra con il tuo account social');

	  $('#social_intro').html("<p>Puoi lavorare su Yucca <strong>per 30 giorni</strong> in uno spazio di prova. "+
							"Accedi con il tuo profilo <strong>Facebook, Google+,Yahoo! </strong></p>"+
							"<p>Al termine di questo periodo, dovrai richiedere un'area di lavoro personale " + 
							"se vorrai continuare a usare la piattaforma.</p>"+
							"<p><strong>Ricorda: dati ed elaborazioni realizzate nello spazio di prova " +
       							"non vengono trasferiti nell'area di lavoro personale.</strong></p>");
          $('#loginForm input.btn-primary').attr('value','Accedi');
          var rememberMecontents = $('#loginForm label.checkbox').contents();
          console.log("rememberMecontents",rememberMecontents);
          if(rememberMecontents !=null && rememberMecontents.length>0)
            rememberMecontents[rememberMecontents.length-1].nodeValue = 'Ricordami su questo computer';
        }
        else{
          $('.different-login-container .AutenticazioneSistemaPiemonte a.main-link').text('Login with Sistemapiemonte');
          $('.different-login-container .AutenticazioneSistemaPiemonte .hint-panel a').attr('href', 'http://www.sistemapiemonte.it/registrazione/index.shtml');
          $('.different-login-container .AutenticazioneSistemaPiemonte .hint-panel a').text('Non hai le credenziali di Sistemapiemonte?');

          $('.different-login-container .AutenticazioneSpid a.main-link').text('Login with SPID');
          $('.different-login-container .AutenticazioneSpid .hint-panel a').attr('href', 'https://www.spid.gov.it/');
          $('.different-login-container .AutenticazioneSpid .hint-panel a').text('Non hai SPID?');

          $('.different-login-container .AutenticazioneRuparPiemonte a.main-link').text('Login with Sistemapiemonte for PA');

          $('.AutenticazioneSocial a.btn-link').text('Login with your social account');

          $('#social_intro').html("<p>You can work on Yucca for <strong>30 days</strong> in a test space. "+
                                                        "Log in with your profile <strong>Facebook, Google+,Yahoo! </strong></p>"+
                                                        "<p>At the end of this period, you will need to request a personal workspace " +
														"if you want to continue using the platform.</p>"+
                                                        "<p><strong>Recall: data and elaborations made in the test space are not transferred to the personal work area.</strong></p>");        

          $('#back-to-home-btn').text('Back to Home Page');
          $('#title-auth').text('Login with your credentials');
          $('.auth-error').text('Authentication Failed! Please Retry');

        }
        $('.different-login-container .AutenticazioneSistemaPiemonte .hint-panel a').attr('href', 'http://www.sistemapiemonte.it/registrazione/index.shtml');
        $('.different-login-container .AutenticazioneSpid .hint-panel a').attr('href', 'https://www.spid.gov.it/');

	$('#local_auth_div #username').attr('placeholder', 'Username');
	$('#local_auth_div #password').attr('placeholder', 'Password');
	// login menu accordion
	var accordionOpen = getCookie('showLogin');
        if(typeof currentTab != 'undefined' && currentTab!=null && accordionOpen=='true'){
           accordionOpen=true;
           toggleAuthAccordion();
        }
        else 
          accordionOpen=false;


        function toggleAuthAccordion(){
                console.log("toggleAuthAccordion", accordionOpen);
                
		$("#local_auth_accordion .accordion_icon").toggleClass("icon-chevron-down");
                $("#local_auth_accordion .accordion_icon").toggleClass("icon-chevron-up");
                if(accordionOpen){
                  	$("#local_auth_accordion .accordion_icon").removeClass("icon-chevron-down");
                        $("#local_auth_accordion .accordion_icon").addClass("icon-chevron-up");
		        $("#local_auth_div").slideDown();
		}
                else{
		        $("#local_auth_accordion .accordion_icon").addClass("icon-chevron-down");
                        $("#local_auth_accordion .accordion_icon").removeClass("icon-chevron-up");
   		     	$("#local_auth_div").slideUp();
                }
                setCookie('showLogin',accordionOpen);
        }

	$('#local_auth_accordion').click(function(event){
		console.log("click accordion ", accordionOpen);
		event.preventDefault();
                accordionOpen = !accordionOpen;
		toggleAuthAccordion();

	});
	
	
});

