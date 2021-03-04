// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  DatacatalogHomeRuparUrl: 'https://int-datacatalog.smartdatanet.it/datacatalog/',
  DatacatalogHomeSistemaPiemonteUrl: 'https://int-datacatalog-pi.smartdatanet.it/datacatalog/',
  DatacatalogHomeSpidUrl: 'https://int-datacatalog-sp.smartdatanet.it/datacatalog/',
  WidgetHomeUrl: 'https://int-userportal.smartdatanet.it/reference',
  UserportalHomeUrl: 'https://int-userportal.smartdatanet.it/userportal',
  // UserportalAuthUrl: 'https://int-userportal.smartdatanet.it/userportal/api/authorize?returnUrl=%23%2F&typeAuth=personal',
  // UserportalAuthTrialUrl: 'https://int-userportal.smartdatanet.it/userportal/api/authorize?returnUrl=%23%2F&typeAuth=trial',
  // DatiPiemonteUrl: 'http://www.dati.piemonte.it',
  // OsservatorioICTUrl: 'http://www.osservatorioict.piemonte.it',

  YUCCA_API_URL: 'https://int-userportal.smartdatanet.it/userportal/api',
  DATACAT_API_URL: 'http://localhost:8080/datacat/api',

  UrlLoginYuccaCitizen: 'https://userportal.smartdatanet.it/userportal/api/authorize?returnUrl=&typeAuth=personal',

  IntroWebAppUrl: 'http://localhost:8080/intro/',

  UserportalInfoUrl: 'https://userportal.smartdatanet.it/userportal/#/info',
  SmartdatanetEmail: 'smartdatanet@csi.it',
  PrivacyInfoUrl: '',
  CookiePolicyUrl: '',
  RegionePiemonteUrl: 'http://www.regione.piemonte.it/',
  CsiPiemonteUrl: 'http://www.csipiemonte.it/',

  //SpidLoginUrl: "https://datacatalog-sp.smartdatanet.it/datacatalog/#/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
