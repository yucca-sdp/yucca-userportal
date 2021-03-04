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
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.csi.yucca.userportal.intro.delegate.HttpDelegate;


@WebServlet(description = "", urlPatterns = { "/stats" }, asyncSupported = true)

public class StatsServlet extends HttpServlet {

	private static final long serialVersionUID = 1063222983928307241L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String statsResponse = HttpDelegate.getInstance().doGet("https://userportal.smartdatanet.it/userportal/api/statistic", null, null, null, null, null);
			
			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			out.println(statsResponse);
			out.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	
}
