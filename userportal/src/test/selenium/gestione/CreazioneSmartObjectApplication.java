package com.example.tests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class CreazioneSmartObjectApplication {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

  @Before
  public void setUp() throws Exception {
    driver = new FirefoxDriver();
    baseUrl = "https://int-userportal.smartdatanet.it/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void testCreazioneSmartObjectApplication() throws Exception {
    driver.get("http://www.google.it");
    driver.get(baseUrl + "/userportal/#/home");
    for (int second = 0;; second++) {
    	if (second >= 60) fail("timeout");
    	try { if (isElementPresent(By.cssSelector("a.btn.main-action-button > span.ng-scope"))) break; } catch (Exception e) {}
    	Thread.sleep(1000);
    }

    try {
      assertTrue(isElementPresent(By.linkText("Login")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.cssSelector("small > a.btn.main-action-button > span.ng-scope")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//button[@type='submit']")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.cssSelector("a.main-menu-item.main-menu-item-management > span.ng-scope")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//tr[3]/td[2]")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.cssSelector("a.btn.btn-new > span.ng-scope")).click();
    assertEquals("Registra lo Smart Object", driver.findElement(By.cssSelector("div.pull-left > h3 > span.ng-scope")).getText());
    new Select(driver.findElement(By.id("inputType"))).selectByVisibleText("Application");
    new Select(driver.findElement(By.id("inputCategory"))).selectByVisibleText("Gateway");
    driver.findElement(By.id("inputVirtualentityCode")).clear();
    driver.findElement(By.id("inputVirtualentityCode")).sendKeys("CodeForaaTestApplication");
    driver.findElement(By.id("inputVirtualentityName")).clear();
    driver.findElement(By.id("inputVirtualentityName")).sendKeys("aaTestApplication");
    driver.findElement(By.id("inputVirtualentityDescription")).clear();
    driver.findElement(By.id("inputVirtualentityDescription")).sendKeys("aaTestDescrApplication");
    driver.findElement(By.cssSelector("a.btn.btn-wizard-next.ng-scope")).click();
    driver.findElement(By.id("RadioGroupPositionType_0")).click();
    driver.findElement(By.id("RadioGroupEsposition_0")).click();
    driver.findElement(By.id("inputVirtualentityLatitude")).clear();
    driver.findElement(By.id("inputVirtualentityLatitude")).sendKeys("1");
    driver.findElement(By.id("inputVirtualentityLongitude")).clear();
    driver.findElement(By.id("inputVirtualentityLongitude")).sendKeys("1");
    driver.findElement(By.id("inputVirtualentityElevation")).clear();
    driver.findElement(By.id("inputVirtualentityElevation")).sendKeys("1");
    driver.findElement(By.id("inputVirtualentityBuilding")).clear();
    driver.findElement(By.id("inputVirtualentityBuilding")).sendKeys("Ed");
    driver.findElement(By.id("inputVirtualentityFloor")).clear();
    driver.findElement(By.id("inputVirtualentityFloor")).sendKeys("Pian");
    driver.findElement(By.id("inputVirtualentityRoom")).clear();
    driver.findElement(By.id("inputVirtualentityRoom")).sendKeys("0");
    driver.findElement(By.xpath("(//a[contains(text(),'Prosegui')])[2]")).click();
    driver.findElement(By.id("inputVirtualentityModel")).clear();
    driver.findElement(By.id("inputVirtualentityModel")).sendKeys("Mod");
    driver.findElement(By.id("RadioGroupSupply_0")).click();
    driver.findElement(By.id("inputVirtualentityAdministrationURI")).clear();
    driver.findElement(By.id("inputVirtualentityAdministrationURI")).sendKeys("URI");
    driver.findElement(By.id("inputVirtualentitySoftwareVersion")).clear();
    driver.findElement(By.id("inputVirtualentitySoftwareVersion")).sendKeys("1");
    driver.findElement(By.xpath("(//a[contains(text(),'Salva')])[2]")).click();
    try {
      assertTrue(isElementPresent(By.cssSelector("div.url > strong.ng-binding")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
