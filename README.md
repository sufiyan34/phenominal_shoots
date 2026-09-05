# Phenomenal Shoots

Cinematic photography + videography portfolio and booking platform.

## Stack

- Next.js + React + TypeScript
- Framer Motion
- Firebase Authentication + Firestore
- Cloudinary for photo/video/file media

## Implemented

### Public site
- Cinematic animated home page with scroll-reactive depth
- Projects + project detail pages
- Stories + story detail pages
- Promotions + detail pages
- Services
- Packages + package detail pages
- About
- Testimonials
- FAQ
- Ask Me
- Contact
- Booking request form
- Private booking status page
- Advance payment proof upload
- Privacy & Terms

### Admin
- Protected admin area with Firebase Auth + role check
- Dashboard
- Projects CRUD
- Stories CRUD
- Promotions CRUD
- Packages CRUD
- Services CRUD
- Testimonials CRUD
- FAQ CRUD
- Availability calendar
- Booking workflow
- Payment proof verification
- Contact / Ask Me inbox + saved replies
- Media library
- Website content editor
- Audit log

### Booking lifecycle

`NEW → UNDER_REVIEW → ACCEPTED → ADVANCE_REQUESTED → PAYMENT_PROOF_SUBMITTED → PAYMENT_VERIFIED → CONFIRMED → COMPLETED`

Alternate outcomes: `REJECTED`, `CANCELLED`.

No bank/card payment gateway is used. The photographer gives payment instructions after acceptance and the client uploads an image proof.

## Setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create Firestore in production mode.
4. Deploy `firestore.rules`.
5. Create an admin user in Firebase Authentication.
6. Add a Firestore document at `users/{ADMIN_UID}` with `{ role: "admin" }` (or `superAdmin`).
7. Create a Cloudinary unsigned upload preset restricted to the intended folders.
8. Copy `.env.example` to `.env.local` and fill the Firebase + Cloudinary values.
9. Install dependencies and run:

```bash
npm install
npm run dev
```

## Environment

`NEXT_PUBLIC_FIREBASE_*` values come from Firebase web app configuration.
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is your Cloudinary cloud name.
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is the unsigned preset used by the browser upload helper.

For production, use a Cloudinary preset with strict folder/resource restrictions and file-size/type limits. Move sensitive/admin upload operations to signed server uploads when the final Cloudinary account policy is established.

## Important production configuration

The code does not invent your Firebase project, Cloudinary account, real photographer content, payment instructions, email provider, or domain. Those values must be supplied by the owner.

Email sending from the admin inbox is intentionally represented as a saved response inside Firestore; connect an email provider (for example Resend, SendGrid, SMTP, or a Firebase-triggered mail service) before relying on one-click outgoing email.
