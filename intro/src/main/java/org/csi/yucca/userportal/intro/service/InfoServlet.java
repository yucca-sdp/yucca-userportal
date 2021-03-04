/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.service;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.csi.yucca.userportal.intro.delegate.HttpDelegate;
import org.csi.yucca.userportal.intro.dto.yucca.User;
import org.csi.yucca.userportal.intro.dto.yucca.UserYuccaReponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@WebServlet(description = "", urlPatterns = { "/info/user" }, asyncSupported = true)
public class InfoServlet extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1063222983928307249L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		try {
			String yuccaResponse = HttpDelegate.getInstance().doGet("https://int-userportal.smartdatanet.it/userportal/api/info", null, null, null, null, null);
			
			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			Gson gson = new GsonBuilder().create();
			PrintWriter out = response.getWriter();
			
			UserYuccaReponse userYucca = gson.fromJson(yuccaResponse, UserYuccaReponse.class); 
			String resp;
			org.csi.yucca.userportal.intro.dto.User userIntro;
			if (userYucca.getUser().getLoggedIn() == false) {
				String datacatResponse = HttpDelegate.getInstance().doGet("https://int-datacatalog.smartdatanet.it/datacatalog/api/session/currentUser", null, null, null, null, null);
				org.csi.yucca.userportal.intro.dto.datacat.User userResponse = gson.fromJson(datacatResponse, org.csi.yucca.userportal.intro.dto.datacat.User.class);
				userIntro = new org.csi.yucca.userportal.intro.dto.User(userResponse);
				resp = gson.toJson(userIntro);
			}else {
				userIntro = new org.csi.yucca.userportal.intro.dto.User(userYucca.getUser());
				resp = gson.toJson(userIntro);
			}
			out.println(resp);
			out.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	
}
