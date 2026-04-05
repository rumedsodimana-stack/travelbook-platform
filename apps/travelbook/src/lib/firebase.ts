import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Shared Firebase config — same project as TravelBook Rides so data is live across both apps
const firebaseConfig = {
  projectId: 'gen-lang-client-0391050882',
  appId: '1:479049208330:web:9758cab8da5291f0d005f3',
  apiKey: 'AIzaSyD4PlpWeNEWZnKS_jlGaz-DApvcBFOPKRc',
  authDomain: 'gen-lang-client-0391050882.firebaseapp.com',
  storageBucket: 'gen-lang-client-0391050882.firebasestorage.app',
  messagingSenderId: '479049208330',
};

// Named Firestore instance used by TravelBook Rides
const FIRESTORE_DB_ID = 'ai-studio-e7284d9c-ab2f-4774-b16d-57c30774f518';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, FIRESTORE_DB_ID);
export default app;
