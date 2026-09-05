import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { SiteSettings } from "@/lib/types";

// site_settings/main is publicly readable (see firestore.rules) and holds
// the studio's editable hero copy, about text, contact info, socials and
// advance-payment instructions. Every public page that displays any of
// those fields should read through this one helper.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "main"));
    return snap.exists() ? (snap.data() as SiteSettings) : {};
  } catch {
    return {};
  }
}

export async function listPublished<T>(name: string, max = 50) {
  const snap = await getDocs(query(collection(db, name), where("status", "==", "published"), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getPublishedBySlug<T>(name: string, slug: string) {
  const snap = await getDocs(query(collection(db, name), where("slug", "==", slug), where("status", "==", "published"), limit(5)));
  const d = snap.docs[0];
  return d ? ({ id: d.id, ...d.data() } as T) : null;
}
