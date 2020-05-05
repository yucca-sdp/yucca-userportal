package org.wso2.carbon.identity.application.authentication.framework.handler.request.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.base.MultitenantConstants;
import org.wso2.carbon.identity.application.authentication.framework.config.ConfigurationFacade;
import org.wso2.carbon.identity.application.authentication.framework.config.model.SequenceConfig;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.framework.context.SessionContext;
import org.wso2.carbon.identity.application.authentication.framework.exception.FrameworkException;
import org.wso2.carbon.identity.application.authentication.framework.handler.request.RequestCoordinator;
import org.wso2.carbon.identity.application.authentication.framework.internal.FrameworkServiceComponent;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils;
import org.wso2.carbon.registry.core.utils.UUIDGenerator;
import org.wso2.carbon.user.api.Tenant;
import org.wso2.carbon.user.api.UserStoreException;

/**
 * Request Coordinator
 * 
 */
public class DefaultRequestCoordinator implements RequestCoordinator {

    private static Log log = LogFactory.getLog(DefaultRequestCoordinator.class);
    private static volatile DefaultRequestCoordinator instance;

    public static DefaultRequestCoordinator getInstance() {

        if (instance == null) {
            synchronized (DefaultRequestCoordinator.class) {
                if (instance == null) {
                    instance = new DefaultRequestCoordinator();
                }
            }
        }

        return instance;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response) throws IOException {

        try {
            AuthenticationContext context = null;
            boolean returning = false;
            // Check whether this is the start of the authentication flow.
            // 'type' parameter should be present if so. This parameter contains
            // the request type (e.g. samlsso) set by the calling servlet.
            // TODO: use a different mechanism to determine the flow start.
            if (request.getParameter(FrameworkConstants.RequestParams.TYPE) != null) {
                context = initializeFlow(request, response);
            } else {
                returning = true;
                context = FrameworkUtils.getContextData(request);
            }

            if (context != null) {
                context.setReturning(returning);
                
                if (!context.isLogoutRequest()) {
                    FrameworkUtils.getAuthenticationRequestHandler().handle(request, response,
                            context);
                } else {
                    FrameworkUtils.getLogoutRequestHandler().handle(request, response, context);
                }
            } else {
                log.error("Context does not exist. Probably due to invalidated cache");
                FrameworkUtils.sendToRetryPage(request, response);
            }
        } catch (Throwable e) {
            log.error("Exception in Authentication Framework", e);
            FrameworkUtils.sendToRetryPage(request, response);
        }
    }

    /**
     * Handles the initial request (from the calling servlet)
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     * @throws ApplicationAuthenticatorException
     */
    protected AuthenticationContext initializeFlow(HttpServletRequest request,
            HttpServletResponse response) throws FrameworkException {

        if (log.isDebugEnabled()) {
            log.debug("Initializing the flow");
        }

        String queryParams = request.getQueryString();

        if (log.isDebugEnabled()) {
            log.debug("The query-string sent by the calling servlet is: " + queryParams);
        }

        // "sessionDataKey" - calling servlet maintains its state information
        // using this
        String callerSessionDataKey = request.getParameter(FrameworkConstants.SESSION_DATA_KEY);

        // "commonAuthCallerPath" - path of the calling servlet. This is the url
        // response should be sent to
        String callerPath = request.getParameter(FrameworkConstants.RequestParams.CALLER_PATH);
        try {
            if (callerPath != null) {
                callerPath = URLDecoder.decode(callerPath, "UTF-8");
            }
        } catch (UnsupportedEncodingException e) {
            throw new FrameworkException(e.getMessage(), e);
        }

        // "type" - type of the request. e.g. samlsso, openid, oauth, passivests
        String requestType = request.getParameter(FrameworkConstants.RequestParams.TYPE);

        // "relyingParty"
        String relyingParty = request.getParameter(FrameworkConstants.RequestParams.ISSUER);
        
        // tenant domain
        String tenantDomain = request.getParameter(FrameworkConstants.RequestParams.TENANT_DOMAIN);

        if (tenantDomain == null || tenantDomain.isEmpty()) {

            String tenantId = request.getParameter(FrameworkConstants.RequestParams.TENANT_ID);

            if (tenantId != null && !tenantId.equals("-1234")) {
                try {
                    Tenant tenant = FrameworkServiceComponent.getRealmService().getTenantManager()
                            .getTenant(Integer.valueOf(tenantId).intValue());
                    if (tenant != null) {
                        tenantDomain = tenant.getDomain();
                    }
                } catch (Exception e) {
                    throw new FrameworkException(e.getMessage(), e);
                }
            } else {
                tenantDomain = MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
            }
        }

        // Store the request data sent by the caller
        AuthenticationContext context = new AuthenticationContext();
        context.setCallerSessionKey(callerSessionDataKey);
        context.setCallerPath(callerPath);
        context.setRequestType(requestType);
        context.setRelyingParty(relyingParty);
        context.setTenantDomain(tenantDomain);
        context.setOrignalRequestQueryParams(queryParams);

        // generate a new key to hold the context data object
        String contextId = UUIDGenerator.generateUUID();
        context.setContextIdentifier(contextId);

        if (log.isDebugEnabled()) {
            log.debug("Framework contextId: " + contextId);
        }

        context.setContextIdIncludedQueryParams(FrameworkUtils
                .getQueryStringWithFrameworkContextId(context.getQueryParams(),
                        callerSessionDataKey, contextId));

        // if this a logout request from the calling servlet
        if (request.getParameter(FrameworkConstants.RequestParams.LOGOUT) != null) {
            
            if (log.isDebugEnabled()) {
                log.debug("Starting a logout flow");
            }
            
            context.setLogoutRequest(true);
            
            if (context.getRelyingParty() == null || context.getRelyingParty().trim().length() == 0) {
                
                if (log.isDebugEnabled()) {
                    log.debug("relyingParty param is null. This is a possible logout scenario.");
                }
                
                Cookie cookie = FrameworkUtils.getAuthCookie(request);
                
                if (cookie != null) {
                    context.setSessionIdentifier(cookie.getValue());
                }
                
                return context;
            }
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Starting an authentication flow");
            }
        }

        findPreviousAuthenticatedSession(request, context);
        FrameworkUtils.addAuthenticationContextToCache(contextId, context, request.getSession()
                .getMaxInactiveInterval());

        return context;
    }

    protected void findPreviousAuthenticatedSession(HttpServletRequest request,
            AuthenticationContext context) throws FrameworkException {
        
        // Get service provider chain
        SequenceConfig sequenceConfig = ConfigurationFacade.getInstance().getSequenceConfig(
                context.getRequestType(),
                request.getParameter(FrameworkConstants.RequestParams.ISSUER),
                context.getTenantDomain());

        Cookie cookie = FrameworkUtils.getAuthCookie(request);

        // if cookie exists user has previously authenticated
        if (cookie != null) {

            if (log.isDebugEnabled()) {
                log.debug(FrameworkConstants.COMMONAUTH_COOKIE
                        + " cookie is available with the value: " + cookie.getValue());
            }

            // get the authentication details from the cache
            SessionContext sessionContext = FrameworkUtils.getSessionContextFromCache(cookie
                    .getValue());

            if (sessionContext != null) {
                context.setSessionIdentifier(cookie.getValue());
                String appName = sequenceConfig.getApplicationConfig().getApplicationName();

                if (log.isDebugEnabled()) {
                    log.debug("Service Provider is: " + appName);
                }

                SequenceConfig previousAuthenticatedSeq = sessionContext
                        .getAuthenticatedSequences().get(appName);

                if (previousAuthenticatedSeq != null) {

                    if (log.isDebugEnabled()) {
                        log.debug("A previously authenticated sequence found for the SP: "
                                + appName);
                    }
                    
                    context.setPreviousSessionFound(true);
                    sequenceConfig = previousAuthenticatedSeq;
                    String authenticatedUser = sequenceConfig.getAuthenticatedUser();

                    if (authenticatedUser != null) {
                        // set the user for the current authentication/logout
                        // flow
                        context.setSubject(authenticatedUser);

                        if (log.isDebugEnabled()) {
                            log.debug("Already authenticated by username: " + authenticatedUser);
                        }
                    }
                }

                context.setPreviousAuthenticatedIdPs(sessionContext.getAuthenticatedIdPs());
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Failed to find the SessionContext from the cache. Possible cache timeout.");
                }
            }
        }

        // set the sequence for the current authentication/logout flow
        context.setSequenceConfig(sequenceConfig);
    }
}
