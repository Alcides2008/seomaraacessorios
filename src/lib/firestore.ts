import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/account";

export type UserProfile = {
  phone?: string;
  birthday?: string;
  gender?: string;
};

/** Lê o perfil estendido do utilizador (users/{uid}). */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : {};
}

/** Grava/atualiza o perfil estendido (merge). */
export async function saveUserProfile(uid: string, data: UserProfile) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

/** Grava um pedido no Firestore (coleção "orders"). */
export async function createOrder(order: Order, uid: string | null) {
  await addDoc(collection(db, "orders"), {
    ...order,
    uid,
    createdAt: serverTimestamp(),
  });
}

/** Pedidos de um utilizador (ordenados por data, no cliente). */
export async function getUserOrders(uid: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Order)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Todas as encomendas (admin). Inclui o id do documento Firestore. */
export type AdminOrder = Order & { _docId: string };

export async function getAllOrders(): Promise<AdminOrder[]> {
  const snap = await getDocs(collection(db, "orders"));
  return snap.docs
    .map((d) => ({ ...(d.data() as Order), _docId: d.id }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Atualiza o estado de uma encomenda. */
export async function updateOrderStatus(docId: string, status: string) {
  const { updateDoc, doc } = await import("firebase/firestore");
  await updateDoc(doc(db, "orders", docId), { status });
}
