// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  cloudinary: {
    cloudName: 'dzqqyy6qn',
    uploadPreset: 'urbaninspect_upload'
  },

  firebase: {
    apiKey: 'AIzaSyCGllvSG7ZmVzAlNoxXwh6aual3WzeQfVk',
    authDomain: 'urbaninspect.firebaseapp.com',
    projectId: 'urbaninspect',
    storageBucket: 'urbaninspect.firebasestorage.app',
    messagingSenderId: '1012714212301',
    appId: '1:1012714212301:web:6af9f12550411f4138d284',
    measurementId: 'G-3WYTEZ0N4N'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
