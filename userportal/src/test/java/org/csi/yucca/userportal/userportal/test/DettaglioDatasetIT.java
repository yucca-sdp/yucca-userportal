/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.test;

import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;


public class DettaglioDatasetIT extends SeleniumBase {

	@BeforeClass
	public void setUpSecretObject() throws IOException {
		super.setUpSecretObject("/testSecret.json");
	}
	
	
	@DataProvider(name = "UserportalDatasetDettaglio")
	public Iterator<Object[]> getFromJson() {

		return super.getFromJson("/UserportalDatasetDettaglio.json");

	}	
	
	
	
	@Test(dataProvider="UserportalDatasetDettaglio", singleThreaded= true)
	public void viewDataset(JSONObject dato) {
		String tenant = dato.getString("up.tenantCode");
		String dataset = dato.getString("up.datasetCode");
		
		driver.navigate().to(dato.getString("up.url"));
		Assert.assertEquals(driver.getTitle(), "Smart Data Platform");
		
		
		if (dato.getBoolean("up.logged"))
		{
			
			driver.navigate().to(dato.getString("up.url")+"/userportal/api/authorize?returnUrl=%23%2Fhome%3FscrollTo%3Dhome-operation-section-anchor");
			driver.findElement(By.name("username")).sendKeys(dato.getString("up.username"));
			driver.findElement(By.name("password")).sendKeys(dato.getString("up.password"));
			driver.findElement(By.id("loginForm")).submit();
			driver.navigate().to(dato.getString("up.url"));
			Assert.assertEquals(driver.getTitle(), "Smart Data Platform");

		}
		
		WebDriverWait wait = new WebDriverWait(driver,2);
		driver.navigate().to(dato.getString("up.url")+"/userportal/#/dataexplorer/dataset/"+tenant+"/"+dataset);
		if (dato.getBoolean("up.toBeFound"))
		{
			wait.until(ExpectedConditions.textToBe(By.cssSelector("small.ng-binding"), dataset +" -"));

			driver.navigate().to(dato.getString("up.url")+"/userportal/#/dataexplorer/"+tenant+"/"+dataset);
			try {
			wait.until(
					ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".alert-danger")));
			}catch(TimeoutException e1 ) {
				Assert.assertTrue(true);
				return;
			}
		}
		else {
			try {
				wait.until(ExpectedConditions.textToBe(By.cssSelector("small.ng-binding"), dataset +" -"));
			}catch(TimeoutException e ) {
					driver.navigate().to(dato.getString("up.url")+"/userportal/#/dataexplorer/"+tenant+"/"+dataset);
					wait.until(
							ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".alert-danger")));
					Assert.assertTrue(true);
					return;
			}
			Assert.assertTrue(false);
		}
		
		if (dato.getBoolean("up.logged"))
		{
			driver.navigate().to(dato.getString("up.url")+"/userportal/api/authorize?logout="+dato.getString("up.username")+"&returnUrl=%23%2Fhome");
		}
	}
	

	
}
