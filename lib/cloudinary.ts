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
