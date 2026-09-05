import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AskQuestion, Availability, Booking, BookingStatus, ContactMessage, Faq, PackageModel, PaymentProof, Project, Promotion, Service, Story, Testimonial } from "@/lib/types";

const stamp = { updatedAt: serverTimestamp() };
export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function createAuditLog(action: string, collectionName: string, recordId: string, detail?: string) {
  try {
    await addDoc(collection(db, "audit_logs"), { action, collection: collectionName, recordId, detail: detail ?? "", createdAt: serverTimestamp() });
  } catch { /* audit logging must never break the primary action */ }
}

export async function createBooking(input: Omit<Booking, "id" | "status" | "publicReference">) {
  const publicReference = `PS-${Date.now().toString(36).toUpperCase()}`;
  const publicToken = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
  const clean = {
    ...input,
    publicReference,
    publicToken,
    status: "NEW" as const,
    requestedAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "bookings"), clean);
  await setDoc(doc(db, "booking_public", publicToken), {
    publicReference,
    publicToken,
    bookingId: ref.id,
    clientName: input.clientName,
    eventType: input.eventType,
    eventDate: input.eventDate,
    location: input.location,
    status: "NEW",
    advanceAmount: null,
    advanceDueDate: null,
    paymentProofId: null,
    updatedAt: serverTimestamp(),
  });
  await createAuditLog("CREATE", "bookings", ref.id, publicReference);
  return { id: ref.id, publicReference, publicToken };
}

export async function getBookingByReference(reference: string) {
  const snap = await getDocs(query(collection(db, "bookings"), where("publicReference", "==", reference), limit(1)));
  const d = snap.docs[0];
  return d ? ({ id: d.id, ...d.data() } as Booking) : null;
}

export async function getPublicBooking(token: string) {
  const snap = await getDoc(doc(db, "booking_public", token));
  return snap.exists() ? snap.data() as Record<string, unknown> : null;
}

export async function listBookings() {
  const snap = await getDocs(query(collection(db, "bookings"), orderBy("requestedAt", "desc"), limit(100)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function updateBookingStatus(id: string, status: BookingStatus, patch: Partial<Booking> = {}) {
  await updateDoc(doc(db, "bookings", id), { ...patch, status, lastUpdatedAt: serverTimestamp() });
  if (patch.paymentProofId) {
    const proofStatus = status === "PAYMENT_VERIFIED" ? "VERIFIED" : status === "ADVANCE_REQUESTED" ? "REJECTED" : undefined;
    if (proofStatus) await updateDoc(doc(db, "payment_proofs", patch.paymentProofId), { status: proofStatus, ...(proofStatus === "VERIFIED" ? { verifiedAt: serverTimestamp() } : {}) });
  }
  const booking = await getDoc(doc(db, "bookings", id));
  if (booking.exists()) {
    const data = booking.data() as Partial<Booking> & { publicToken?: string; publicReference?: string };
    if (data.publicToken) {
      await setDoc(doc(db, "booking_public", data.publicToken), {
        publicReference: data.publicReference ?? "",
        publicToken: data.publicToken,
        bookingId: id,
        clientName: data.clientName ?? "",
        eventType: data.eventType ?? "",
        eventDate: data.eventDate ?? "",
        location: data.location ?? "",
        status,
        advanceAmount: patch.advanceAmount ?? data.advanceAmount ?? null,
        advanceDueDate: patch.advanceDueDate ?? data.advanceDueDate ?? null,
        paymentProofId: patch.paymentProofId ?? data.paymentProofId ?? null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  }
  await createAuditLog("UPDATE_STATUS", "bookings", id, status);
}

export async function listCollection<T>(name: string) {
  const snap = await getDocs(query(collection(db, name), limit(200)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function deleteItem(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
  await createAuditLog("DELETE", collectionName, id);
}

export async function saveItem<T extends { id?: string }>(collectionName: string, input: T) {
  const { id, ...data } = input as T & { id?: string };
  let recordId = id;
  if (id) {
    await setDoc(doc(db, collectionName, id), { ...data, ...stamp }, { merge: true });
  } else {
    const ref = await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    recordId = ref.id;
  }
  await createAuditLog(id ? "UPDATE" : "CREATE", collectionName, recordId ?? "unknown");
  return recordId;
}

export const listProjects = () => listCollection<Project>("projects");
export const listPackages = () => listCollection<PackageModel>("packages");
export const listStories = () => listCollection<Story>("stories");
export const listPromotions = () => listCollection<Promotion>("promotions");
export const listServices = () => listCollection<Service>("services");
export const listTestimonials = () => listCollection<Testimonial>("testimonials");
export const listFaqs = () => listCollection<Faq>("faqs");
export const listAvailability = () => listCollection<Availability>("availability");
export const listContactMessages = () => listCollection<ContactMessage>("contact_messages");
export const listAskQuestions = () => listCollection<AskQuestion>("ask_questions");
export const listPaymentProofs = () => listCollection<PaymentProof>("payment_proofs");
export const getPackage = async (id: string) => { const snap = await getDoc(doc(db, "packages", id)); return snap.exists() ? ({ id: snap.id, ...snap.data() } as PackageModel) : null; };
