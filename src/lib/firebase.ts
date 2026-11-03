import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Config Web do projeto Firebase da Siomara. NÃO é secreta: vai sempre no código do
// browser; a segurança está no firestore.rules. Fica aqui como valor oficial porque
// uma colagem estragada no Vercel (ex.: a chave mascarada "AIzaSyBc•••") partia o login.
const SIOMARA = {
  apiKey: "AIzaSyBccM2Vve1KLcnjyFPjm4TKpgtRdQyzaQY",
  authDomain: "siomara-acessorios.firebaseapp.com",
  projectId: "siomara-acessorios",
  storageBucket: "siomara-acessorios.firebasestorage.app",
  messagingSenderId: "553917581430",
  appId: "1:553917581430:web:ddfa0cf3f0346333b3b757",
};

/** Usa a variável de ambiente só se tiver o formato esperado; senão, o valor oficial. */
const env = (value: string | undefined, valid: RegExp, fallback: string) => {
  const v = value?.trim();
  return v && valid.test(v) ? v : fallback;
};

const firebaseConfig = {
  apiKey: env(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, /^AIza[0-9A-Za-z_-]{35}$/, SIOMARA.apiKey),
  authDomain: env(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, /^[a-z0-9.-]+$/, SIOMARA.authDomain),
  projectId: env(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, /^[a-z0-9-]+$/, SIOMARA.projectId),
  storageBucket: env(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, /^[a-z0-9.-]+$/, SIOMARA.storageBucket),
  messagingSenderId: env(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, /^\d+$/, SIOMARA.messagingSenderId),
  appId: env(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, /^1:\d+:web:[0-9a-f]+$/, SIOMARA.appId),
};

/** Há sempre config válida (a oficial vem no código); mantido para quem já o usa. */
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Leituras com alternativa local: se o Firestore não responder a tempo (ex.: no build
 * do Vercel o SDK fica à espera para sempre), rejeita e quem chama usa os dados locais.
 */
export function withTimeout<T>(p: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), ms)),
  ]);
}
