/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

@WebServlet(description = "Api proxy Servlet  for resources", urlPatterns = { "/api/proxy/resources/*" }, asyncSupported = false)
public class ApiResourcesProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static final String DEFAULT_ENTITY_ICON_PATH = "img/stream-icon-default.png";

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		Properties config = Config.loadServerConfiguration();
		String apiBaseUrl = config.getProperty(Config.API_MANAGEMENT_URL_KEY);
		String requestUri = request.getRequestURI();
		boolean isStream = requestUri.startsWith("/userportal/api/proxy/resources/stream");
		if (isStream) {
			apiBaseUrl = config.getProperty(Config.API_SERVICES_URL_KEY);
		}
		Map<String, String[]> parameterMap = new HashMap<String, String[]>(request.getParameterMap());

		String parameters = "";
		if (parameterMap != null && parameterMap.size() > 0) {
			for (String key : parameterMap.keySet()) {
				if (!key.trim().equalsIgnoreCase("callback")) {
					parameters += key + "=" + URLEncoder.encode(parameterMap.get(key)[0], "UTF-8").replace("[+]", "%2B").replace("+", "%20");
				}
			}
		}

		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");
		if (isStream) {
			path = path.replaceAll("stream/icon", "streams");
			String tenant = path.split("[/]")[2];
			path += "?visibleFrom=" + tenant;
		}

		String completeUrl = apiBaseUrl + path;

		GetMethod getMethod = new GetMethod(completeUrl);

		String authorizationHeader = request.getHeader("Authorization");
		if (authorizationHeader != null)
			getMethod.setRequestHeader("Authorization", authorizationHeader);

		HttpClient httpclient = new HttpClient();
		int result = httpclient.executeMethod(getMethod);
		response.setStatus(result);
		if (getMethod.getResponseHeader("Content-Type") != null)
			response.setContentType(getMethod.getResponseHeader("Content-Type").getValue());

		Header contentDisposition = getMethod.getResponseHeader("Content-Disposition");
		if (contentDisposition != null)
			response.setHeader("Content-Disposition", getMethod.getResponseHeader("Content-Disposition").getValue());

		ServletOutputStream out = response.getOutputStream();
		InputStream in = null;
		if (isStream) {
			String streamJson = getMethod.getResponseBodyAsString();
			in = extractImageFromStream(streamJson);
			// in = new
			// ByteArrayInputStream(streamIcon.getBytes(StandardCharsets.UTF_8));
		} else {
			in = getMethod.getResponseBodyAsStream();
		}

		byte[] bytes = new byte[4096];
		int bytesRead;

		while ((bytesRead = in.read(bytes)) != -1) {
			out.write(bytes, 0, bytesRead);
		}

		in.close();
		out.close();

	}

	private InputStream extractImageFromStream(String streamJson) throws IOException {
		Gson gson = JSonHelper.getInstance();
		StreamsForIcon streamsForIcon = gson.fromJson(streamJson, StreamsForIcon.class);
		InputStream streamIconIS = null;
		BufferedImage imag = null;
		if (streamsForIcon != null && streamsForIcon.getStreams() != null && streamsForIcon.getStreams().getStream() != null
				&& streamsForIcon.getStreams().getStream().getStreamIcon() != null) {
			String streamIcon = streamsForIcon.getStreams().getStream().getStreamIcon();

			imag = readStreamImageBuffer(streamIcon);
		} else
			imag = ImageIO.read(ApiResourcesProxyServlet.class.getClassLoader().getResourceAsStream("stream-icon-default.png"));

		byte[] iconBytes = null;
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ImageIO.write(imag, "png", baos);
		baos.flush();
		iconBytes = baos.toByteArray();
		baos.close();

		streamIconIS = new ByteArrayInputStream(iconBytes);

		return streamIconIS;
	}

	public class StreamsForIcon {
		private Streams streams;

		public StreamsForIcon() {

		}

		public Streams getStreams() {
			return streams;
		}

		public void setStreams(Streams streams) {
			this.streams = streams;
		}

	}

	public class Streams {
		private Stream stream;

		public Streams() {
		}

		public Stream getStream() {
			return stream;
		}

		public void setStream(Stream stream) {
			this.stream = stream;
		}
	}

	public class Stream {
		private String streamIcon;

		public Stream() {
		}

		public String getStreamIcon() {
			return streamIcon;
		}

		public void setStreamIcon(String streamIcon) {
			this.streamIcon = streamIcon;
		}

	}

	public BufferedImage readStreamImageBuffer(String imageBase64) throws IOException {
		BufferedImage imag = null;

		if (imageBase64 != null) {
			String[] imageBase64Array = imageBase64.split(",");

			String imageBase64Clean;
			if (imageBase64Array.length > 1) {
				imageBase64Clean = imageBase64Array[1];
			} else {
				imageBase64Clean = imageBase64Array[0];
			}

			byte[] bytearray = Base64.decodeBase64(imageBase64Clean.getBytes());
			imag = ImageIO.read(new ByteArrayInputStream(bytearray));
		}
		if (imageBase64 == null || imag == null) {
			imag = ImageIO.read(ApiResourcesProxyServlet.class.getClassLoader().getResourceAsStream("stream-icon-default.png"));

		}
		return imag;
	}
}
