import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { cert, getApps, initializeApp } from "firebase-admin/app";

function adminApp() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return NextResponse.json({error:"Unauthorized"},{status:401});

    adminApp();
    const decoded = await getAuth().verifyIdToken(token);

    // The rest of the app decides "is this user an admin" via the
    // users/{uid}.role Firestore document (see AuthProvider + firestore.rules)
    // — this used to check a Firebase Auth custom claim instead, which
    // nothing in the project ever set, so this endpoint 403'd for every
    // real admin. Checking the same Firestore field keeps one source of truth.
    const userDoc = await getFirestore().collection("users").doc(decoded.uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : null;
    if (role !== "admin" && role !== "superAdmin") return NextResponse.json({error:"Forbidden"},{status:403});

    const body = await request.json() as { folder?: string; timestamp?: number };
    const timestamp = body.timestamp ?? Math.floor(Date.now() / 1000);
    const folder = body.folder ?? "phenomenal-shoots";
    const toSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET ?? ""}`;
    const signature = createHash("sha1").update(toSign).digest("hex");

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch {
    return NextResponse.json({error:"Unable to create upload signature"},{status:500});
  }
}
