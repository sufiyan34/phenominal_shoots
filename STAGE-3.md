# Stage 3 — Full CMS & Operations

This stage turns the admin side into a usable content-management and operations layer.

## Included

### CMS CRUD
- Projects
- Stories
- Promotions
- Packages
- Services
- Testimonials
- FAQ

Each module supports:
- Firestore loading
- add/create
- edit
- delete
- publish/draft status where applicable
- media upload through Cloudinary helper where applicable

### Media Library
- Upload image/video
- Save Cloudinary metadata in Firestore
- Reuse hosted assets

### Website Content
Editable main settings for:
- homepage hero
- manifesto
- about text
- contact information
- social links
- advance-payment instructions

### Bookings
- Firestore booking list
- status workflow
- review
- accept/reject
- request advance amount + due date
- verify/reject payment proof
- confirm
- complete

### Availability
Calendar-based date states:
- available
- blocked
- tentative
- booked

### Messages
- Contact inbox
- Ask Me inbox
- unread/read handling
- saved admin replies
- delete

## Important setup

1. Create your Firebase project.
2. Enable Email/Password authentication.
3. Add an admin user document at `users/{UID}` with:
   `role: "admin"`
4. Create Firestore database.
5. Publish `firestore.rules`.
6. Create a Cloudinary upload preset for the current client-side upload helper and set the environment variables from `.env.example`.
7. Run `npm install` and then `npm run dev`.

## Remaining production work

The architecture is now ready for the production-hardening pass:
- stronger Cloudinary signed uploads for admin/media operations
- booking-scoped payment-proof authorization
- server-side notification/email integration
- public pages reading published Firestore content instead of mock content
- robust form validation and anti-spam controls
- audit-log UI
- advanced gallery/project media management
- production security review and deployment configuration
