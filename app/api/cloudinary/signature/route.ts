import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";

function adminAuth() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getAuth();
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return NextResponse.json({error:"Unauthorized"},{status:401});

    const decoded = await adminAuth().verifyIdToken(token);
    if (!decoded.admin) return NextResponse.json({error:"Forbidden"},{status:403});

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
