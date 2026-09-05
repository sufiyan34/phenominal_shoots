export type PublishStatus = "draft" | "published";
export type BookingStatus = "NEW"|"UNDER_REVIEW"|"ACCEPTED"|"ADVANCE_REQUESTED"|"PAYMENT_PROOF_SUBMITTED"|"PAYMENT_VERIFIED"|"CONFIRMED"|"COMPLETED"|"REJECTED"|"CANCELLED";
export type MediaType = "image"|"video"|"raw";
export interface MediaAsset { id?: string; name: string; publicId: string; secureUrl: string; resourceType?: string; type?: MediaType; folder?: string; createdAt?: unknown; }
export interface Project { id?: string; slug:string; title:string; category:string; location?:string; description?:string; coverImage:string; gallery?:string[]; status:PublishStatus; featured?:boolean; createdAt?:unknown; updatedAt?:unknown; }
export interface PackageModel { id?:string; slug:string; name:string; priceLabel:string; description?:string; features:string[]; status:PublishStatus; createdAt?:unknown; updatedAt?:unknown; }
export interface Story { id?:string; slug:string; title:string; excerpt?:string; body?:string; coverImage?:string; status:PublishStatus; featured?:boolean; publishedAt?:string; createdAt?:unknown; updatedAt?:unknown; }
export interface Promotion { id?:string; slug:string; title:string; description?:string; offer?:string; image?:string; startsAt?:string; endsAt?:string; status:PublishStatus; createdAt?:unknown; updatedAt?:unknown; }
export interface Service { id?:string; title:string; description:string; image?:string; status:PublishStatus; sortOrder:number; createdAt?:unknown; updatedAt?:unknown; }
export interface Testimonial { id?:string; clientName:string; quote:string; role?:string; image?:string; status:PublishStatus; featured?:boolean; createdAt?:unknown; updatedAt?:unknown; }
export interface Faq { id?:string; question:string; answer:string; status:PublishStatus; sortOrder:number; createdAt?:unknown; updatedAt?:unknown; }
export interface Booking { id?:string; publicReference:string; publicToken:string; clientName:string; email:string; phone:string; eventType:string; eventDate:string; endDate?:string; location:string; packageId?:string; packageSnapshot?:{id?:string;name?:string;priceLabel?:string}; notes?:string; status:BookingStatus; advanceAmount?:number|null; advanceDueDate?:string|null; paymentProofId?:string|null; requestedAt?:unknown; acceptedAt?:unknown; confirmedAt?:unknown; lastUpdatedAt?:unknown; internalNotes?:string; }
// Shape of the public-facing mirror document at booking_public/{publicToken}.
// Deliberately narrower than Booking — it's the subset safe to expose to an
// anonymous visitor holding the link, per firestore.rules (`allow read: if true`).
export interface BookingPublic { publicReference:string; publicToken:string; bookingId:string; clientName:string; eventType:string; eventDate:string; location:string; status:BookingStatus; advanceAmount?:number|null; advanceDueDate?:string|null; paymentProofId?:string|null; updatedAt?:unknown; }
export interface SiteSettings { heroTitle?:string; heroSubtitle?:string; manifesto?:string; about?:string; contactEmail?:string; contactPhone?:string; instagram?:string; tiktok?:string; youtube?:string; advanceInstructions?:string; updatedAt?:unknown; }
export interface ContactMessage { id?:string; name:string; email:string; phone?:string; message:string; status:"unread"|"read"|"archived"; createdAt?:unknown; }
export interface AskQuestion { id?:string; name:string; email:string; question:string; status:"unread"|"read"|"archived"; createdAt?:unknown; }
export interface PaymentProof { id?:string; bookingId:string; publicReference:string; assetUrl:string; cloudinaryPublicId:string; amount?:number|null; paymentReference?:string; status:"SUBMITTED"|"VERIFIED"|"REJECTED"; uploadedAt?:unknown; verifiedAt?:unknown; adminNote?:string; }
export interface Availability { id?:string; date:string; status:"available"|"tentative"|"booked"|"blocked"; note?:string; }
