/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.RootLogger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.Proxy.ProxyType;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

public class SeleniumBase {
	protected WebDriver driver;
	protected static JSONObject secretObject = new JSONObject();
	Logger logger = RootLogger.getLogger("SeleniumBase");

	static {
		BasicConfigurator.configure();
	}
	
	protected void recreateDriver() {
		if (driver!=null) {
			driver.quit();
		}
		String http_proxy = System.getProperty("http_proxy");
		String https_proxy = System.getProperty("https_proxy");
		String no_proxy = System.getProperty("no_proxy");

		logger.info("http_proxy:["+ http_proxy+ "] https_proxy:["+ https_proxy+"] no_proxy:["+ no_proxy+"]");

		DesiredCapabilities cap = new DesiredCapabilities();
		org.openqa.selenium.Proxy proxy = new Proxy();
		
		if (http_proxy == null && https_proxy == null)
		{
			proxy.setProxyType(ProxyType.DIRECT);
		} else {
			proxy.setHttpProxy(http_proxy);
			proxy.setSslProxy(https_proxy);
			proxy.setNoProxy(no_proxy);			
		}
		
		cap.setCapability(CapabilityType.PROXY, proxy);
		
		
		FirefoxProfile profile = new FirefoxProfile();
		profile.setPreference("browser.cache.disk.enable", false);
		profile.setPreference("browser.cache.memory.enable", false);
		profile.setPreference("browser.cache.offline.enable", false);
		profile.setPreference("network.http.use-cache", false);
		
		driver = new FirefoxDriver(new FirefoxBinary(),profile,cap);
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	}
	
	public void setUpSecretObject(String file) throws IOException {
		String str = readFile(file);
		secretObject = new JSONObject(str);

	}

	protected static Iterator<Object[]> getFromJson(String file) {
		ArrayList<Object[]> data = new ArrayList();

		String str = readFile(file);
		JSONObject json = new JSONObject(str);
		JSONArray jsArray = json.getJSONArray("data");

		for (int i = 0; i < jsArray.length(); i++) {
			JSONObject arr = jsArray.getJSONObject(i);

			// merge with secret

			Iterator iterSecret = secretObject.keys();
			String tmp_key;
			while (iterSecret.hasNext()) {
				tmp_key = (String) iterSecret.next();
				if (!arr.has(tmp_key)) {
					arr.put(tmp_key, secretObject.get(tmp_key));
				}
			}

			data.add(new Object[] { arr });
		}

		return data.iterator();

	}

	protected static String readFile(String file) {
		String jsonData = "";
		BufferedReader br = null;
		try {
			String line;
			InputStream inputStream = SeleniumBase.class.getResourceAsStream(file);
			if (inputStream!=null)
			{
				InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
				br = new BufferedReader(inputStreamReader);
				while ((line = br.readLine()) != null) {
					jsonData += line + "\n";
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null)
					br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return jsonData;
	}
	
		
	@BeforeMethod
	public void setupSelenium() {
		// Start the browser (firefox for now)
		//driver = new FirefoxDriver();
		recreateDriver();
	}
	
	@AfterTest
    public void closeSelenium(){
		if (driver!=null)
			driver.quit();
    }
}
