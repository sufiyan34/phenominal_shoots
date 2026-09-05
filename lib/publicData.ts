import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listPublished<T>(name: string, max = 50) {
  const snap = await getDocs(query(collection(db, name), where("status", "==", "published"), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getPublishedBySlug<T>(name: string, slug: string) {
  const snap = await getDocs(query(collection(db, name), where("slug", "==", slug), limit(5)));
  const d = snap.docs.find((item) => item.data().status === "published");
  return d ? ({ id: d.id, ...d.data() } as T) : null;
}
