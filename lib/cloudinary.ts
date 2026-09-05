import { auth } from "@/lib/firebase/client";

// Unsigned upload via a public preset. Used only where the uploader is an
// anonymous site visitor (the payment-proof form) — there's no Firebase ID
// token to send in that case, so a signed upload isn't possible there.
export async function uploadPublicToCloudinary(file: File, folder: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error("Cloudinary public upload is not configured.");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", folder);

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method:"POST", body:form });
  if (!upload.ok) throw new Error("Cloudinary upload failed");
  return await upload.json() as { secure_url:string; public_id:string; resource_type:string };
}

// Signed upload for admin/media operations. Requires a signed-in admin
// (verified server-side in /api/cloudinary/signature against the same
// users/{uid}.role check the rest of the app uses) — no public upload
// preset involved, so it isn't exposed to anonymous visitors.
export async function uploadSignedToCloudinary(file: File, folder: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in as an admin to upload.");
  const idToken = await user.getIdToken();

  const signatureRes = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ folder }),
  });
  if (!signatureRes.ok) throw new Error("Could not authorize this upload.");
  const { timestamp, signature, apiKey, cloudName, folder: signedFolder } = await signatureRes.json() as
    { timestamp: number; signature: string; apiKey?: string; cloudName?: string; folder: string };
  if (!apiKey || !cloudName) throw new Error("Cloudinary admin credentials are not configured on the server.");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", signedFolder);

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method:"POST", body:form });
  if (!upload.ok) throw new Error("Cloudinary upload failed");
  return await upload.json() as { secure_url:string; public_id:string; resource_type:string };
}
