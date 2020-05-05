package com.example.tests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class CreazioneDataSetConAllegati {
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
  public void testCreazioneDataSetConAllegati() throws Exception {
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
      assertTrue(isElementPresent(By.linkText("Dataset")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.linkText("Dataset")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//td[2]")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.xpath("//a/span[2]")).click();
    driver.findElement(By.id("inputDatasetName")).clear();
    driver.findElement(By.id("inputDatasetName")).sendKeys("testDataSet");
    new Select(driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div/new-dataset-wizard-start/form/div[2]/div/select"))).selectByVisibleText("Salute");
    driver.findElement(By.linkText("Next")).click();
    driver.findElement(By.id("requestorName")).clear();
    driver.findElement(By.id("requestorName")).sendKeys("nome");
    driver.findElement(By.id("requestorSurname")).clear();
    driver.findElement(By.id("requestorSurname")).sendKeys("cognome");
    driver.findElement(By.id("requestorEmail")).clear();
    driver.findElement(By.id("requestorEmail")).sendKeys("mymail");
    driver.findElement(By.name("accettazionePrivacy")).click();
    driver.findElement(By.name("accettazioneResponsability")).click();
    driver.findElement(By.xpath("(//a[contains(text(),'Next')])[2]")).click();
    driver.findElement(By.id("inputDatasetDesc")).clear();
    driver.findElement(By.id("inputDatasetDesc")).sendKeys("testDescr");
    new Select(driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div[3]/new-dataset-wizard-metadata/form/div[2]/div/div/select"))).selectByVisibleText("Fuoco");
    driver.findElement(By.cssSelector("i.glyphicon.glyphicon-plus")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//div[@id='newDatasetWizard']/div/div[3]/new-dataset-wizard-metadata/form/div[2]/div/p/span/span")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.id("RadioGroupVisibility_0")).click();
    driver.findElement(By.id("inputDatasetLicence")).clear();
    driver.findElement(By.id("inputDatasetLicence")).sendKeys("lic");
    driver.findElement(By.id("inputDatasetDisclaimer")).clear();
    driver.findElement(By.id("inputDatasetDisclaimer")).sendKeys("restr");
    driver.findElement(By.id("inputDatasetCopyright")).clear();
    driver.findElement(By.id("inputDatasetCopyright")).sendKeys("copy");
    driver.findElement(By.xpath("(//a[contains(text(),'Next')])[3]")).click();
    driver.findElement(By.linkText("Definisci le colonne")).click();
    driver.findElement(By.xpath("(//input[@type='text'])[10]")).clear();
    driver.findElement(By.xpath("(//input[@type='text'])[10]")).sendKeys("uno");
    driver.findElement(By.xpath("(//input[@type='text'])[11]")).clear();
    driver.findElement(By.xpath("(//input[@type='text'])[11]")).sendKeys("due");
    new Select(driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div[6]/new-dataset-wizard-columns/form/div/ng-include/div/div[4]/div[4]/select"))).selectByVisibleText("int");
    new Select(driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div[6]/new-dataset-wizard-columns/form/div/ng-include/div/div[4]/div[6]/select"))).selectByVisibleText("sec");
    driver.findElement(By.xpath("//input[@type='checkbox']")).click();
    driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div[6]/new-dataset-wizard-columns/form/div/ng-include/div/div[4]/div[10]/a/i")).click();
    driver.findElement(By.xpath("(//input[@type='text'])[16]")).clear();
    driver.findElement(By.xpath("(//input[@type='text'])[16]")).sendKeys("ssss");
    driver.findElement(By.xpath("(//input[@type='text'])[17]")).clear();
    driver.findElement(By.xpath("(//input[@type='text'])[17]")).sendKeys("ffff");
    driver.findElement(By.xpath("//div[@id='newDatasetWizard']/div/div[6]/new-dataset-wizard-columns/form/div/ng-include/div/div[7]/div[3]/div[4]/a/i")).click();
    driver.findElement(By.linkText("Crea dataset")).click();
    for (int second = 0;; second++) {
    	if (second >= 60) fail("timeout");
    	try { if (isElementPresent(By.cssSelector("div.url > strong.ng-binding"))) break; } catch (Exception e) {}
    	Thread.sleep(1000);
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
