const firebaseConfig = {
  apiKey: process.env.VUE_APP_ANALYTICS_APIKEY,
  authDomain: process.env.VUE_APP_ANALYTICS_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_ANALYTICS_DATABASEURL,
  projectId: process.env.VUE_APP_ANALYTICS_PROJECTID,
  storageBucket: process.env.VUE_APP_ANALYTICS_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_ANALYTICS_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_ANALYTICS_APPID,
  measurementId: process.env.VUE_APP_ANALYTICS_MEASUREMENTID,
}

console.log(process.env);

// Initialize Firebase
const firebase = (window as any).firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()
