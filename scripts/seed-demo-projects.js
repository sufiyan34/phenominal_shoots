/**
 * Seeds the Firestore "projects" collection with demo/placeholder entries
 * so the public /projects page and the admin CRUD screen have something
 * to show right away.
 *
 * These are placeholder photos and copy only — swap them for real shoots
 * before launch (see README.md / FINAL-STATUS.md).
 *
 * Usage:
 *   node scripts/seed-demo-projects.js
 *
 * Requires the same FIREBASE_ADMIN_* values already in your .env.local
 * (the ones used by app/api/cloudinary/signature/route.ts).
 *
 * Safe to re-run: each project uses a deterministic doc ID (its slug),
 * so re-running this just overwrites the same demo docs instead of
 * creating duplicates.
 */

const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

function initAdmin() {
  const required = ["FIREBASE_ADMIN_PROJECT_ID", "FIREBASE_ADMIN_CLIENT_EMAIL", "FIREBASE_ADMIN_PRIVATE_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}. Check your .env.local.`);
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

// Reuses the same placeholder photography already shipped in data/mock.ts
// so nothing new/unverified is introduced.
const demoProjects = [
  {
    slug: "the-royal-wedding",
    title: "The Royal Wedding",
    category: "Wedding Films",
    location: "Lahore",
    description: "A full-day cinematic wedding film paired with a documentary-style stills gallery, cut for atmosphere over spectacle.",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85",
    ],
    status: "published",
    featured: true,
  },
  {
    slug: "beyond-the-mountains",
    title: "Beyond the Mountains",
    category: "Travel Film",
    location: "Hunza",
    description: "A five-day travel documentary shot across Hunza's valleys, built around natural light and long-lens landscape work.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    ],
    status: "published",
    featured: true,
  },
  {
    slug: "drive-of-passion",
    title: "Drive of Passion",
    category: "Automotive Film",
    location: "Islamabad",
    description: "A short automotive commercial combining drone tracking shots with studio-lit detail work.",
    coverImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85",
    ],
    status: "published",
    featured: false,
  },
  {
    slug: "portrait-of-elegance",
    title: "Portrait of Elegance",
    category: "Portrait Photography",
    location: "Karachi",
    description: "A studio portrait series focused on minimal, editorial-grade lighting and directed posing.",
    coverImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1600&q=85",
    ],
    status: "published",
    featured: false,
  },
  {
    slug: "lights-camera-celebration",
    title: "Lights, Camera, Celebration",
    category: "Event Film",
    location: "Lahore",
    description: "Multi-camera coverage of a corporate launch event, delivered as a same-week highlight edit.",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=85",
    ],
    status: "draft",
    featured: false,
  },
];

async function main() {
  const db = initAdmin();
  const col = db.collection("projects");
  const batch = db.batch();

  for (const project of demoProjects) {
    const ref = col.doc(project.slug);
    batch.set(ref, {
      ...project,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${demoProjects.length} demo projects into Firestore "projects":`);
  for (const p of demoProjects) console.log(`  - ${p.slug} (${p.status})`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed demo projects:", err.message || err);
  process.exit(1);
});
