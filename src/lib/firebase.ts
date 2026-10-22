import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// As chaves vêm de variáveis de ambiente (ver .env.local).
// Para Firebase Web, estas chaves NÃO são secretas — são expostas no cliente.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Está o Firebase configurado? (evita erros antes de colar as chaves) */
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);

// Sem chaves (projeto Firebase da Siomara ainda por criar): valores de
// demonstração só para o SDK arrancar; as leituras usam os dados locais.
const app = getApps().length
  ? getApp()
  : initializeApp(
      isFirebaseConfigured
        ? firebaseConfig
        : { apiKey: "demo-key", projectId: "demo-siomara", appId: "demo" },
    );

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
