/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.userportal.test;

import java.io.IOException;
import java.util.Iterator;

import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class DeleteDatasetIT extends SeleniumBase {

	@BeforeClass
	public void setUpSecretObject() throws IOException {
		super.setUpSecretObject("/testSecret.json");
	}

	@DataProvider(name = "UserportalDatasetDelete")
	public Iterator<Object[]> getFromJson() {

		return super.getFromJson("/UserportalDatasetDelete.json");

	}

	@Test(dataProvider = "UserportalDatasetDelete", singleThreaded = true)
	public void deleteDataset(JSONObject dato) {
		String tenant = dato.getString("up.tenantCode");
		String dataset = dato.getString("up.datasetCode");

		driver.navigate().to(dato.getString("up.url"));
		Assert.assertEquals(driver.getTitle(), "Smart Data Platform");

		if (dato.getBoolean("up.logged")) {

			driver.navigate().to(dato.getString("up.url") + "/userportal/api/authorize?returnUrl=%23%2Fhome%3FscrollTo%3Dhome-operation-section-anchor");
			driver.findElement(By.name("username")).sendKeys(dato.getString("up.username"));
			driver.findElement(By.name("password")).sendKeys(dato.getString("up.password"));
			driver.findElement(By.id("loginForm")).submit();
			driver.navigate().to(dato.getString("up.url"));
			Assert.assertEquals(driver.getTitle(), "Smart Data Platform");

		}

		WebDriverWait wait = new WebDriverWait(driver, 10,100);
		driver.navigate().to(dato.getString("up.url") + "/userportal/#/management/viewDataset/" + tenant + "/" + dataset);

		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".card-toolbar .btn-delete")));
			WebElement deleteButton = driver.findElements(By.cssSelector(".card-toolbar .btn-delete")).get(0);
			String disableAttribute = deleteButton.getAttribute("disabled");
			boolean isDisabled = true;
			if (disableAttribute == null || (!disableAttribute.equals("disabled") && !disableAttribute.equals("true")))
				isDisabled = false;

			if (!dato.getBoolean("up.canDelete")) {
				Assert.assertEquals(isDisabled, true);
			} else {
				deleteButton.click();
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("datasetModalContent")));
				Assert.assertTrue(true);
			}
		} catch (TimeoutException e) {
			Assert.assertTrue(false);
			return;
		}

		if (dato.getBoolean("up.logged")) {
			driver.navigate().to(dato.getString("up.url") + "/userportal/api/authorize?logout=" + dato.getString("up.username") + "&returnUrl=%23%2Fhome");
		}
	}

}
