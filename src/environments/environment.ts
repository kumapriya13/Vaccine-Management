// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: "https://p22yd5wq15.execute-api.us-east-2.amazonaws.com:443/", // qa
  apiUrl: 'https://sejvd34b7j.execute-api.us-east-2.amazonaws.com:443/', // int
  // apiUrl: "https://g21kc1vmwe.execute-api.us-east-2.amazonaws.com/", // prod
  // apiUrl: 'http://54.218.219.106:9000/', // demo
    // apiUrl: "https://e1wh7iox09.execute-api.us-east-2.amazonaws.com/", //demo-new
  sso_url: 'https://vms.auth.ap-south-1.amazoncognito.com/login?',
  client_id: '6nth7ffvec85nllqmdimdnd8ph',
  captchaKey: '6LezUG4aAAAAAKdZykSbyhBLbiy7l8ria_azt59m', //localhost

  powerBI: {
    reportBaseURL: 'https://app.powerbi.com/reportEmbed',
    qnaBaseURL: 'https://app.powerbi.com/qnaEmbed',
    tileBaseURL: 'https://app.powerbi.com/embed',
    groupID: '87cb103b-a404-402f-bd56-628bf2a068d2',
    reportID: '3ff5be14-67ad-49d4-bc3e-ebed8f142140'
  },
  biKey: 'https://app.powerbi.com/view?r=eyJrIjoiOWQ1ODVhYzUtZjFiZi00OTJkLWIyZDMtYTIxNmE3MjY0NmFiIiwidCI6ImIwNGY2NDUwLTJlOTMtNDUzMi04ZTgzLWZjMzk0YzY3NzAyOCIsImMiOjEwfQ%3D%3D', //Int

  //logo-images
  logoImg: '../../../../assets/images/png/Logo.png', //Local-img
};

/*
//qa:- "https://p22yd5wq15.execute-api.us-east-2.amazonaws.com:443/",
//int:- https://sejvd34b7j.execute-api.us-east-2.amazonaws.com:443/
//demo:- "http://54.218.219.106:9000/",
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
