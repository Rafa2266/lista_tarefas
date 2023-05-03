import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBWDUewZn9aFgxZJ-WbugJDRaaMxClkFZ0",
  authDomain: "projeto-overview-e80c8.firebaseapp.com",
  projectId: "projeto-overview-e80c8",
  storageBucket: "projeto-overview-e80c8.appspot.com",
  messagingSenderId: "872717090273",
  appId: "1:872717090273:web:341c1bae29e5b85166e6a0",
  measurementId: "G-NPQ5TBKXP6"
};

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth= getAuth(firebaseApp);

  export{ db,auth };