/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.utils;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.text.ParseException;
import java.util.Date;

import net.minidev.json.JSONObject;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.HttpDelegate;
import org.csi.yucca.userportal.userportal.entity.admin.tenant.Tenant;
import org.csi.yucca.userportal.userportal.info.User;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

public class JWTUtil {

	static Logger log = Logger.getLogger(HttpDelegate.class);

	static public JSONObject getJsonFromJwt(String jwt) throws ParseException {
		JWSObject jwsObject;
		try {
			jwsObject = JWSObject.parse(jwt);
			return jwsObject.getPayload().toJSONObject();
		} catch (java.text.ParseException e) {
			log.error("[JWTUtil::getFieldValueFromJwt] Error during parsing [" + jwt + "]", e);
			throw e;
		}
	}

	public static SignedJWT createSecretJwt(User user) {

		SignedJWT signedJWT = null;
		KeyPairGenerator keyGenerator;
		try {
			keyGenerator = KeyPairGenerator.getInstance("RSA");

			keyGenerator.initialize(1024);

			KeyPair kp = keyGenerator.genKeyPair();
			// RSAPublicKey publicKey = (RSAPublicKey) kp.getPublic();
			RSAPrivateKey privateKey = (RSAPrivateKey) kp.getPrivate();

			// Create RSA-signer with the private key
			JWSSigner signer = new RSASSASigner(privateKey);

			// Prepare JWT with claims set

			Date expirationTime = new Date(1577833200000L); // 01/01/2020;
			String subscriberRoles = "";
			if (user.getTenants() != null) {
				for (Tenant tenant : user.getTenants()) {
					subscriberRoles += tenant.getTenantcode() + "_subscriber,";
				}
			}

			JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.RS256, JOSEObjectType.JWT, null, null, null, null, null, null, null, null, null, null, null);
			JWTClaimsSet claimsSet = new JWTClaimsSet.Builder().issuer("http://wso2.org/gateway").claim("http://wso2.org/gateway/subscriber", user.getUsername())
					.claim("http://wso2.org/gateway/subscriber", user.getUsername()).claim("http://wso2.org/gateway/applicationname", "userportal")
					.claim("http://wso2.org/gateway/enduser", user.getUsername()).claim("http://wso2.org/claims/givenname", user.getFirstname())
					.claim("http://wso2.org/claims/lastname", user.getLastname())
					.claim("http://wso2.org/claims/role", "userportal-superuser," + subscriberRoles + "Internal/subscriber,Internal/everyone")

					.expirationTime(expirationTime).build();

			signedJWT = new SignedJWT(jwsHeader, claimsSet);

			// Compute the RSA signature
			signedJWT.sign(signer);

		} catch (NoSuchAlgorithmException e) {
			log.error("[JWTUtil::createSecretJwt - ERROR " + e.getMessage());
			e.printStackTrace();
		} catch (JOSEException e) {
			log.error("[JWTUtil::createSecretJwt - ERROR " + e.getMessage());
			e.printStackTrace();
		}
		return signedJWT;
	}

	public static void main(String[] args) throws ParseException {
		String jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJTSEEyNTZ3aXRoUlNBIiwieDV0IjoiTVRkbE5HSTRNbVUwWVRNMVpXVXdOMkppTm1SaE1qWm1ZakZoTlRVeVltTmxNRFZoTTJFNU1BIn0.eyJpc3MiOiJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheSIsImV4cCI6MTUwNzk3OTc1MTI2MiwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvc3Vic2NyaWJlciI6ImFkbWluIiwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvYXBwbGljYXRpb25uYW1lIjoidXNlcnBvcnRhbDIiLCJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheS9lbmR1c2VyIjoidXNlcnRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9naXZlbm5hbWUiOiJVc2VyIiwgImh0dHA6Ly93c28yLm9yZy9jbGFpbXMvaWRlbnRpdHkvdGVybUNvbmRpdGlvblRlbmFudHMiOiJ8dHN0X2NzcHx0c3RfYXJwYV9ydW1vcmV8dHN0X3JlZ3BpZXxwcm92YV96ZXJvMDAxfHByb3ZhX3plcm8wMDIiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9sYXN0bmFtZSI6IlRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9yb2xlIjoidXNlcnBvcnRhbC1zdXBlcnVzZXIsdHN0X2NzcF9zdWJzY3JpYmVyLHRzdF9hcnBhX3J1bW9yZV9zdWJzY3JpYmVyLHRzdF9yZWdwaWVfc3Vic2NyaWJlcixwcm92YV96ZXJvMDAxX3N1YnNjcmliZXIsSW50ZXJuYWwvdXNlcnBvcnRhbCxJbnRlcm5hbC9zdWJzY3JpYmVyLEludGVybmFsL2V2ZXJ5b25lIn0.h05V-5rwNK-LfEFO2bAPRo4W5krolqabdOk8XreCD4HuUktvWelwwIz-AnhQuOa-Cw-wCBlwfj_JWeUa8M4Wkl2UoajMdhI7z6W5tMDfakrlnob3BtOaTwCgPROl5r1h4moXX9u9wiOZXRrZ_uyeWOXJPOVgpIOfq_MnB2z0iniKVN0pkEQkVubcKZIqxbfxYn589fTknPGj30URrIQndiIidRObu01u3Vg_GjNO0rj6mLLu_K__ZH9XiNxo88-NpLvsuf2SeanzWzlFdG5lqeEZQ1ALUYSicbvvrhZfNhpjV7wG-b2My_vpxQ_tvcD8rhk-FVAHxPrJheAg1yMVZA";

		JSONObject jsonObj = JWTUtil.getJsonFromJwt(jwt);

		log.info(jsonObj.toJSONString());
	}

}
